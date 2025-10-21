import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent?: Category;
    children?: Category[];
    is_active: boolean;
    position: number;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    sku: string;
    price: string;
    formatted_price: string;
    created_at: string;
}

interface Props {
    category: Category & {
        products: Product[];
        products_count: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
    },
    {
        title: 'Show',
        href: '/admin/categories/show',
    },
];

export default function Show({ category }: Props) {
    const handleToggleStatus = () => {
        router.patch(`/admin/categories/${category.id}/toggle-status`, {}, {
            preserveState: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category - ${category.name}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{category.name}</h1>
                        <p className="text-muted-foreground">
                            Category details and products
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/categories">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Categories
                            </Button>
                        </Link>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleToggleStatus}
                        >
                            {category.is_active ? (
                                <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
                            ) : (
                                <ToggleLeft className="h-4 w-4 mr-2 text-gray-400" />
                            )}
                            {category.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Category Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Category Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Name</label>
                                <p className="text-gray-900">{category.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Slug</label>
                                <p className="text-gray-900 font-mono text-sm">{category.slug}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Description</label>
                                <p className="text-gray-900">{category.description || 'No description'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Parent Category</label>
                                <p className="text-gray-900">{category.parent?.name || 'Root category'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Position</label>
                                <p className="text-gray-900">{category.position}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Status</label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    category.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Products Count</label>
                                <p className="text-2xl font-bold text-gray-900">{category.products_count}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Subcategories</label>
                                <p className="text-2xl font-bold text-gray-900">{category.children?.length || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Created</label>
                                <p className="text-gray-900">{new Date(category.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                <p className="text-gray-900">{new Date(category.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/admin/categories/${child.id}`}
                                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900">{child.name}</h3>
                                    <p className="text-sm text-gray-600">{child.slug}</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                        child.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {child.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                {category.products && category.products.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Products in this Category</h2>
                        <div className=" border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {category.products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{product.title}</div>
                                                    <div className="text-sm text-muted-foreground">{product.slug}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {product.sku}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.formatted_price}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {(!category.products || category.products.length === 0) && (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products in this category</h3>
                        <p className="text-gray-600">Products will appear here when they are assigned to this category.</p>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
