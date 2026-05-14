import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';

interface RoleOption {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    roleOptions: RoleOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Add user', href: '/admin/users/create' },
];

export default function Create({ roleOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_ids: roleOptions.length === 1 ? [roleOptions[0].id] : ([] as number[]),
    });

    const toggleRole = (id: number, checked: boolean) => {
        if (checked) {
            setData('role_ids', [...data.role_ids, id]);
        } else {
            setData(
                'role_ids',
                data.role_ids.filter((x) => x !== id),
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Add user" />

            <div className="mx-auto max-w-xl space-y-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Add user</h1>
                        <p className="text-muted-foreground text-sm">
                            They can sign in with the email and password you set here.
                        </p>
                    </div>
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="off"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Roles</Label>
                        <p className="text-muted-foreground text-xs">At least one role is required.</p>
                        <div className="space-y-2 rounded-lg border p-4">
                            {roleOptions.map((role) => (
                                <label key={role.id} className="flex cursor-pointer items-center gap-3">
                                    <Checkbox
                                        checked={data.role_ids.includes(role.id)}
                                        onCheckedChange={(v) => toggleRole(role.id, v === true)}
                                    />
                                    <span className="text-sm">
                                        <span className="font-medium">{role.name}</span>
                                        <span className="text-muted-foreground"> ({role.slug})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.role_ids} />
                    </div>

                    <Button type="submit" disabled={processing || data.role_ids.length === 0}>
                        <Save className="mr-2 h-4 w-4" />
                        Create user
                    </Button>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
