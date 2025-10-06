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
import { ArrowLeft, Edit, Trash2, Image, User } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Array<{
        name: string;
    }>;
}

interface ProductImage {
    id: number;
    src: string;
    is_primary: boolean;
    position: number;
}

interface ProductDetail {
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    position: number;
    is_active: boolean;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    short_description?: string;
    long_description?: string;
    sku: string;
    currency: string;
    price: string;
    formatted_price: string;
    created_at: string;
    updated_at: string;
    categories?: Category[];
    images?: ProductImage[];
    details?: ProductDetail[];
    users_with_access?: User[];
}

interface Props {
    product: Product;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
    {
        title: 'Show',
        href: '/admin/products/show',
    },
];

export default function Show({ product }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product - ${product.title}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <p className="text-muted-foreground">
                            Product details and information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/products">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/images`}>
                            <Button variant="outline">
                                <Image className="h-4 w-4 mr-2" />
                                Manage Images
                            </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Title</label>
                                    <p className="text-gray-900">{product.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Slug</label>
                                    <p className="text-gray-900 font-mono text-sm">{product.slug}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">SKU</label>
                                    <p className="text-gray-900 font-mono text-sm">{product.sku}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Price</label>
                                    <p className="text-gray-900 font-bold text-lg">{product.formatted_price}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Short Description</label>
                                    <p className="text-gray-900">{product.short_description || 'No short description'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Long Description</label>
                                    <div className="text-gray-900 prose max-w-none">
                                        {product.long_description ? (
                                            <div dangerouslySetInnerHTML={{ __html: product.long_description }} />
                                        ) : (
                                            'No long description'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/admin/categories/${category.id}`}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Details */}
                        {product.details && product.details.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                                <div className="space-y-4">
                                    {product.details
                                        .filter(detail => detail.is_active)
                                        .sort((a, b) => a.position - b.position)
                                        .map((detail) => (
                                            <div key={detail.id} className="border rounded-lg p-4">
                                                <h3 className="font-medium text-gray-900">{detail.title}</h3>
                                                {detail.subtitle && (
                                                    <p className="text-sm text-gray-600 mt-1">{detail.subtitle}</p>
                                                )}
                                                {detail.image && (
                                                    <img
                                                        src={detail.image}
                                                        alt={detail.title}
                                                        className="mt-2 rounded-lg max-w-xs"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Statistics */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Images Count</label>
                                    <p className="text-2xl font-bold text-gray-900">{product.images?.length || 0}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Details Count</label>
                                    <p className="text-2xl font-bold text-gray-900">{product.details?.length || 0}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Users with Access</label>
                                    <p className="text-2xl font-bold text-gray-900">{product.users_with_access?.length || 0}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Categories</label>
                                    <p className="text-2xl font-bold text-gray-900">{product.categories?.length || 0}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Created</label>
                                    <p className="text-gray-900">{new Date(product.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Primary Image */}
                        {product.images && product.images.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Primary Image</h2>
                                {(() => {
                                    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                                    return (
                                        <div>
                                            <img
                                                src={primaryImage.src}
                                                alt={product.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <p className="text-sm text-gray-600 mt-2">
                                                {product.images.length} total image{product.images.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* User Access */}
                        {product.users_with_access && product.users_with_access.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Users with Access</h2>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {product.users_with_access.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-2 p-2 border rounded">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-600">{user.email}</p>
                                                {user.roles && user.roles.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {user.roles.map((role, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* No Images Message */}
                {(!product.images || product.images.length === 0) && (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📷</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                        <p className="text-gray-600 mb-4">Add images to showcase this product.</p>
                        <Link href={`/admin/products/${product.id}/images`}>
                            <Button>
                                <Image className="h-4 w-4 mr-2" />
                                Manage Images
                            </Button>
                        </Link>
                    </div>
                )}

                {/* No Details Message */}
                {(!product.details || product.details.length === 0) && (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No product details</h3>
                        <p className="text-gray-600 mb-4">Add detailed information about this product.</p>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                        </Link>
                    </div>
                )}

                {/* No User Access Message */}
                {(!product.users_with_access || product.users_with_access.length === 0) && (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-gray-400 text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users have access</h3>
                        <p className="text-gray-600 mb-4">Grant access to users so they can view this product.</p>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
