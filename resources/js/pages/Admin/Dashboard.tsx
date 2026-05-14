import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    FolderTree,
    Gem,
    ImageOff,
    Link2,
    Package,
    Shield,
    UserPlus,
    Users,
} from 'lucide-react';

interface CategoryBrief {
    id: number;
    name: string;
    slug: string;
}

interface RecentProduct {
    id: number;
    title: string;
    slug: string;
    sku: string;
    formatted_price: string;
    images_count: number;
    categories: CategoryBrief[];
    created_at: string | null;
}

interface TopCategory {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    products_count: number;
}

interface RecentMember {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string | null;
}

interface ProductNeedingImages {
    id: number;
    title: string;
    slug: string;
    sku: string;
}

interface Stats {
    products: number;
    categories: number;
    active_categories: number;
    inactive_categories: number;
    members: number;
    members_pending_verification: number;
    staff_admin_or_manager: number;
    product_access_assignments: number;
    products_without_images: number;
}

interface Props {
    stats: Stats;
    recent_products: RecentProduct[];
    top_categories: TopCategory[];
    recent_members: RecentMember[];
    products_needing_images: ProductNeedingImages[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Dashboard', href: dashboard().url },
];

function formatShortDate(iso: string | null): string {
    if (!iso) {
        return '—';
    }
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return '—';
    }
}

export default function AdminDashboard({
    stats,
    recent_products,
    top_categories,
    recent_members,
    products_needing_images,
}: Props) {
    const statCards = [
        {
            label: 'Products',
            value: stats.products,
            hint: 'In catalog',
            icon: Package,
            href: '/admin/products',
        },
        {
            label: 'Categories',
            value: stats.categories,
            hint: `${stats.active_categories} active · ${stats.inactive_categories} inactive`,
            icon: FolderTree,
            href: '/admin/categories',
        },
        {
            label: 'Members',
            value: stats.members,
            hint:
                stats.members_pending_verification > 0
                    ? `${stats.members_pending_verification} pending email verification`
                    : 'Registered customers (user role)',
            icon: Users,
            href: '/admin/users',
        },
        {
            label: 'Product access',
            value: stats.product_access_assignments,
            hint: 'Member ↔ product links',
            icon: Link2,
            href: '/admin/products',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin dashboard" />

            <div className="space-y-8 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your Kothari Jewels catalog, members, and items that need attention.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ label, value, hint, icon: Icon, href }) => {
                        const inner = (
                            <Card className="h-full transition-colors hover:border-primary/30">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {label}
                                    </CardTitle>
                                    <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold tabular-nums">{value}</div>
                                    <p className="text-muted-foreground mt-2 text-xs leading-snug">{hint}</p>
                                </CardContent>
                            </Card>
                        );
                        return href ? (
                            <Link key={label} href={href} className="block">
                                {inner}
                            </Link>
                        ) : (
                            <div key={label}>{inner}</div>
                        );
                    })}
                </div>

                {stats.products_without_images > 0 && (
                    <Card className="border-amber-500/40 bg-amber-500/5">
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                            <ImageOff className="text-amber-600 size-5 dark:text-amber-400" aria-hidden />
                            <div>
                                <CardTitle className="text-base">
                                    {stats.products_without_images} product
                                    {stats.products_without_images === 1 ? '' : 's'} without images
                                </CardTitle>
                                <CardDescription>
                                    Add at least one image so pieces display correctly for members.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Gem className="size-5" aria-hidden />
                                    Recent products
                                </CardTitle>
                                <CardDescription>Newest items in the catalog</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/products">View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recent_products.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No products yet.</p>
                            ) : (
                                recent_products.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex flex-col gap-1 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/admin/products/${p.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {p.title}
                                            </Link>
                                            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                                <span>SKU {p.sku}</span>
                                                <span>·</span>
                                                <span>{p.formatted_price}</span>
                                                <span>·</span>
                                                <span>{formatShortDate(p.created_at)}</span>
                                            </div>
                                            {p.categories.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {p.categories.map((c) => (
                                                        <Badge key={c.id} variant="secondary" className="text-xs">
                                                            {c.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                                            {p.images_count === 0 ? (
                                                <Badge variant="destructive" className="text-xs">
                                                    No images
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs tabular-nums">
                                                    {p.images_count} image{p.images_count === 1 ? '' : 's'}
                                                </Badge>
                                            )}
                                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                                                <Link href={`/admin/products/${p.id}/images`}>Images</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderTree className="size-5" aria-hidden />
                                    Top categories
                                </CardTitle>
                                <CardDescription>By number of assigned products</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/categories">Manage</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {top_categories.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No categories yet.</p>
                            ) : (
                                top_categories.map((c) => (
                                    <div
                                        key={c.id}
                                        className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2 text-sm transition-colors hover:border-border hover:bg-muted/40"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Link
                                                href={`/admin/categories/${c.id}`}
                                                className="truncate font-medium hover:underline"
                                            >
                                                {c.name}
                                            </Link>
                                            {!c.is_active && (
                                                <Badge variant="outline" className="text-xs">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-muted-foreground shrink-0 tabular-nums">
                                            {c.products_count}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="size-5" aria-hidden />
                                Newest members
                            </CardTitle>
                            <CardDescription>Users with the member (user) role</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recent_members.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No members yet.</p>
                            ) : (
                                recent_members.map((m) => (
                                    <div
                                        key={m.id}
                                        className="flex flex-col gap-0.5 rounded-lg border border-transparent px-2 py-2 text-sm transition-colors hover:border-border hover:bg-muted/40 sm:flex-row sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <span className="font-medium">{m.name}</span>
                                            <p className="text-muted-foreground truncate text-xs">{m.email}</p>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                                            {!m.email_verified_at && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Unverified
                                                </Badge>
                                            )}
                                            <span className="text-muted-foreground text-xs">
                                                {formatShortDate(m.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" aria-hidden />
                                Catalog checks
                            </CardTitle>
                            <CardDescription>Quick actions for incomplete records</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {products_needing_images.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Every product has at least one image.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {products_needing_images.map((p) => (
                                        <li
                                            key={p.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 text-sm transition-colors hover:border-border hover:bg-muted/40"
                                        >
                                            <Link
                                                href={`/admin/products/${p.id}`}
                                                className="min-w-0 flex-1 truncate font-medium hover:underline"
                                            >
                                                {p.title}
                                            </Link>
                                            <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                <Link href={`/admin/products/${p.id}/images`}>Add images</Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                        <CardFooter className="text-muted-foreground flex flex-wrap items-center gap-2 border-t pt-6 text-xs">
                            <Shield className="size-3.5 shrink-0" aria-hidden />
                            <span>
                                {stats.staff_admin_or_manager} admin or manager account
                                {stats.staff_admin_or_manager === 1 ? '' : 's'} can manage this area.
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
