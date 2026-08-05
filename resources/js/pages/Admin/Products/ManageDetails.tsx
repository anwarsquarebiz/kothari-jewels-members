import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, List, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

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
    details?: ProductDetail[];
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
        title: 'Manage Details',
        href: '/admin/products/details',
    },
];

function DetailEditForm({
    productId,
    detail,
    onCancel,
}: {
    productId: number;
    detail: ProductDetail;
    onCancel: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: detail.title,
        subtitle: detail.subtitle || '',
        image: detail.image || '',
        position: detail.position,
        is_active: detail.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${productId}/details/${detail.id}`, {
            onSuccess: () => onCancel(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`edit-title-${detail.id}`}>Title *</Label>
                    <Input
                        id={`edit-title-${detail.id}`}
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. Diamonds"
                        className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor={`edit-position-${detail.id}`}>Position</Label>
                    <Input
                        id={`edit-position-${detail.id}`}
                        type="number"
                        min="0"
                        value={data.position}
                        onChange={(e) => setData('position', parseInt(e.target.value) || 0)}
                        className={errors.position ? 'border-red-500' : ''}
                    />
                    {errors.position && (
                        <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor={`edit-subtitle-${detail.id}`}>Subtitle</Label>
                    <Input
                        id={`edit-subtitle-${detail.id}`}
                        value={data.subtitle}
                        onChange={(e) => setData('subtitle', e.target.value)}
                        placeholder="e.g. Baguette Cut Diamonds totalling 7.87 Carats"
                        className={errors.subtitle ? 'border-red-500' : ''}
                    />
                    {errors.subtitle && (
                        <p className="text-sm text-red-600 mt-1">{errors.subtitle}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor={`edit-image-${detail.id}`}>Image path (optional)</Label>
                    <Input
                        id={`edit-image-${detail.id}`}
                        value={data.image}
                        onChange={(e) => setData('image', e.target.value)}
                        placeholder="media/materials/5.jpg"
                        className={errors.image ? 'border-red-500' : ''}
                    />
                    {errors.image && (
                        <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id={`edit-active-${detail.id}`}
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="rounded"
                />
                <Label htmlFor={`edit-active-${detail.id}`}>Active (shown on storefront)</Label>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={processing} size="sm">
                    <Save className="h-3 w-3 mr-1" />
                    {processing ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default function ManageDetails({ product }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        subtitle: '',
        image: '',
        position: (product.details?.length || 0) + 1,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}/details`, {
            onSuccess: () => {
                reset();
                setData('position', (product.details?.length || 0) + 2);
                setData('is_active', true);
            },
        });
    };

    const handleDelete = (detailId: number) => {
        if (confirm('Are you sure you want to delete this detail?')) {
            router.delete(`/admin/products/${product.id}/details/${detailId}`);
        }
    };

    const sortedDetails =
        [...(product.details || [])].sort((a, b) => a.position - b.position);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage Details - ${product.title}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manage Details</h1>
                        <p className="text-muted-foreground">
                            Specs & materials for: {product.title}
                        </p>
                    </div>
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Product
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Add New Detail</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Diamonds, Emeralds, Material"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="number"
                                    min="0"
                                    value={data.position}
                                    onChange={(e) =>
                                        setData('position', parseInt(e.target.value) || 0)
                                    }
                                    className={errors.position ? 'border-red-500' : ''}
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g. Baguette Cut Diamonds totalling 7.87 Carats"
                                    className={errors.subtitle ? 'border-red-500' : ''}
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-red-600 mt-1">{errors.subtitle}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="image">Image path (optional)</Label>
                                <Input
                                    id="image"
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    placeholder="media/materials/5.jpg"
                                    className={errors.image ? 'border-red-500' : ''}
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="is_active">Active (shown on storefront)</Label>
                        </div>
                        <Button type="submit" disabled={processing}>
                            <Plus className="h-4 w-4 mr-2" />
                            {processing ? 'Adding...' : 'Add Detail'}
                        </Button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Current Details</h2>
                    {sortedDetails.length === 0 ? (
                        <div className="text-center py-12">
                            <List className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No details yet
                            </h3>
                            <p className="text-gray-600">
                                Add your first detail using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedDetails.map((detail) => (
                                <div key={detail.id}>
                                    {editingId === detail.id ? (
                                        <DetailEditForm
                                            productId={product.id}
                                            detail={detail}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <div className="flex items-start justify-between gap-4 border rounded-lg p-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-medium text-gray-900">
                                                        {detail.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        Position: {detail.position}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            detail.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {detail.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                {detail.subtitle && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {detail.subtitle}
                                                    </p>
                                                )}
                                                {detail.image && (
                                                    <p className="text-xs text-gray-500 mt-1 font-mono truncate">
                                                        {detail.image}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingId(detail.id)}
                                                >
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(detail.id)}
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Tips</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                            • Title is used for the label and icon (e.g. names containing
                            &quot;Diamond&quot; or &quot;Emerald&quot; map to matching icons)
                        </li>
                        <li>• Subtitle appears as the value on the right of each row</li>
                        <li>• Position controls display order on the product page</li>
                        <li>• Only active details are shown on the storefront</li>
                    </ul>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
