import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type PaginatedData, type Role } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, KeyRound, Package, Save, Search, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface RoleOption {
    id: number;
    name: string;
    slug: string;
}

interface UserPayload {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    roles: Role[];
}

interface ProductRow {
    id: number;
    title: string;
    slug: string;
    sku: string;
    formatted_price: string;
    categories?: { id: number; name: string }[];
}

interface Props {
    user: UserPayload;
    roleOptions: RoleOption[];
    products: PaginatedData<ProductRow>;
    accessible_product_ids: number[];
    product_filters: { search?: string };
    actor_is_admin: boolean;
    is_self: boolean;
}

export default function Show({
    user,
    roleOptions,
    products,
    accessible_product_ids,
    product_filters,
    actor_is_admin,
    is_self,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: 'Admin', href: '/admin/dashboard' },
            { title: 'Users', href: '/admin/users' },
            { title: user.name, href: `/admin/users/${user.id}` },
        ],
        [user.id, user.name],
    );

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        role_ids: user.roles.map((r) => r.id),
        is_active: user.is_active,
    });

    useEffect(() => {
        profileForm.setData({
            name: user.name,
            email: user.email,
            role_ids: user.roles.map((r) => r.id),
            is_active: user.is_active,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync server user into the form after saves
    }, [user.id, user.updated_at]);

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const [productSearch, setProductSearch] = useState(product_filters.search || '');
    const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
        () => new Set(accessible_product_ids),
    );

    useEffect(() => {
        setSelectedProductIds(new Set(accessible_product_ids));
    }, [accessible_product_ids]);

    const toggleRole = (id: number, checked: boolean) => {
        const next = new Set(profileForm.data.role_ids);
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
        profileForm.setData('role_ids', Array.from(next));
    };

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch(`/admin/users/${user.id}`);
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.patch(`/admin/users/${user.id}/password`, {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset('password', 'password_confirmation'),
        });
    };

    const toggleProduct = (id: number, checked: boolean) => {
        setSelectedProductIds((prev) => {
            const next = new Set(prev);
            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    const saveProductAccess = () => {
        router.patch(
            `/admin/users/${user.id}/product-access`,
            { product_ids: Array.from(selectedProductIds) },
            { preserveScroll: true },
        );
    };

    const searchProducts = () => {
        router.get(
            `/admin/users/${user.id}`,
            { product_search: productSearch },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`User · ${user.name}`} />

            <div className="space-y-10 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.roles.map((r) => (
                                <Badge key={r.id} variant="secondary">
                                    {r.name}
                                </Badge>
                            ))}
                            {user.is_active ? (
                                <Badge variant="outline">Active</Badge>
                            ) : (
                                <Badge variant="destructive">Access revoked</Badge>
                            )}
                            {user.email_verified_at ? (
                                <Badge variant="outline">Email verified</Badge>
                            ) : (
                                <Badge variant="secondary">Email not verified</Badge>
                            )}
                        </div>
                    </div>
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            All users
                        </Button>
                    </Link>
                </div>

                {/* Profile & access */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="size-5" aria-hidden />
                        <h2 className="text-lg font-semibold">Profile &amp; system access</h2>
                    </div>
                    <form onSubmit={submitProfile} className="max-w-xl space-y-4 rounded-xl border p-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                            />
                            <InputError message={profileForm.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                            />
                            <InputError message={profileForm.errors.email} />
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                            <div>
                                <Label htmlFor="is_active">Account active</Label>
                                <p className="text-muted-foreground text-xs">
                                    When off, the user cannot sign in (access revoked).
                                </p>
                            </div>
                            <Switch
                                id="is_active"
                                checked={profileForm.data.is_active}
                                disabled={is_self}
                                onCheckedChange={(v) => profileForm.setData('is_active', v === true)}
                            />
                        </div>
                        <InputError message={profileForm.errors.is_active} />

                        <div className="space-y-2">
                            <Label>Roles</Label>
                            <div className="space-y-2 rounded-lg border p-4">
                                {roleOptions.map((role) => (
                                    <label key={role.id} className="flex cursor-pointer items-center gap-3">
                                        <Checkbox
                                            checked={profileForm.data.role_ids.includes(role.id)}
                                            onCheckedChange={(v) => toggleRole(role.id, v === true)}
                                        />
                                        <span className="text-sm">
                                            <span className="font-medium">{role.name}</span>
                                            <span className="text-muted-foreground"> ({role.slug})</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={profileForm.errors.role_ids} />
                            {!actor_is_admin && (
                                <p className="text-muted-foreground text-xs">
                                    Managers can only assign the member role.
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={profileForm.processing || profileForm.data.role_ids.length === 0}>
                            <Save className="mr-2 h-4 w-4" />
                            Save profile
                        </Button>
                    </form>
                </section>

                <Separator />

                {/* Password */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <KeyRound className="size-5" aria-hidden />
                        <h2 className="text-lg font-semibold">Change password</h2>
                    </div>
                    <form onSubmit={submitPassword} className="max-w-xl space-y-4 rounded-xl border p-6">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New password</Label>
                            <Input
                                id="new_password"
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                            <InputError message={passwordForm.errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new_password_confirmation">Confirm new password</Label>
                            <Input
                                id="new_password_confirmation"
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <Button type="submit" disabled={passwordForm.processing}>
                            Update password
                        </Button>
                    </form>
                </section>

                <Separator />

                {/* Product access */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Package className="size-5" aria-hidden />
                        <h2 className="text-lg font-semibold">Product access</h2>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        Members only see catalogue items you grant here. Search to find products, tick or untick rows,
                        then save. Selections are kept when you change pages.
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <Label htmlFor="product_search">Search products</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="product_search"
                                    placeholder="Title, SKU, or slug…"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                                />
                                <Button type="button" variant="outline" onClick={searchProducts}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Button type="button" onClick={saveProductAccess}>
                            Save product access
                        </Button>
                    </div>

                    <div className="border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12" />
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Categories</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground text-center">
                                            No products match this search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProductIds.has(p.id)}
                                                    onCheckedChange={(v) => toggleProduct(p.id, v === true)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{p.title}</TableCell>
                                            <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                                            <TableCell>{p.formatted_price}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {p.categories?.slice(0, 3).map((c) => (
                                                        <Badge key={c.id} variant="secondary" className="text-xs">
                                                            {c.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {products.links && products.links.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppSidebarLayout>
    );
}
