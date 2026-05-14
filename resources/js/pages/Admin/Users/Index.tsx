import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type PaginatedData, type Role, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface UserRow extends User {
    roles: Role[];
    is_active: boolean;
}

interface Props {
    users: PaginatedData<UserRow>;
    filters: {
        search?: string;
        status?: string;
    };
    actor_is_admin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function Index({ users, filters, actor_is_admin }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(
            '/admin/users',
            { search, status: status === 'all' ? '' : status },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p className="text-muted-foreground">
                            Create accounts, control access, and assign which products each member can see.
                        </p>
                        {!actor_is_admin && (
                            <p className="text-muted-foreground mt-2 text-sm">
                                As a manager you can only manage member accounts (not other admins or managers).
                            </p>
                        )}
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add user
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Label htmlFor="search">Search</Label>
                        <div className="flex gap-2">
                            <Input
                                id="search"
                                placeholder="Name or email…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button type="button" variant="outline" onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Revoked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="secondary" onClick={handleSearch}>
                        Apply filters
                    </Button>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Access</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-muted-foreground text-center">
                                        No users match your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {u.roles?.map((r) => (
                                                    <Badge key={r.id} variant="secondary">
                                                        {r.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {u.is_active ? (
                                                <Badge variant="outline">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Revoked</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/users/${u.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {users.links && users.links.length > 0 && (
                    <div className="flex justify-center">
                        <nav className="flex flex-wrap justify-center gap-2">
                            {users.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
