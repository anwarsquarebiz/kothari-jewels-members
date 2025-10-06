import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
    id: number;
    src: string;
    is_primary: boolean;
    position: number;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    images?: ProductImage[];
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
        title: 'Manage Images',
        href: '/admin/products/images',
    },
];

export default function ManageImages({ product }: Props) {
    const [newImageSrc, setNewImageSrc] = useState('');
    const [newImagePosition, setNewImagePosition] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        src: '',
        is_primary: false,
        position: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}/images`, {
            onSuccess: () => {
                setNewImageSrc('');
                setNewImagePosition(1);
                setData('src', '');
                setData('is_primary', false);
                setData('position', 1);
            }
        });
    };

    const handleSetPrimary = (imageId: number) => {
        // This would need to be implemented with a proper API call
        console.log('Set primary image:', imageId);
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            // This would need to be implemented with a proper API call
            console.log('Delete image:', imageId);
        }
    };

    const sortedImages = product.images?.sort((a, b) => a.position - b.position) || [];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage Images - ${product.title}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manage Images</h1>
                        <p className="text-muted-foreground">
                            Manage images for: {product.title}
                        </p>
                    </div>
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Product
                        </Button>
                    </Link>
                </div>

                {/* Add New Image */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Add New Image</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="src">Image URL</Label>
                                <Input
                                    id="src"
                                    value={data.src}
                                    onChange={(e) => setData('src', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={errors.src ? 'border-red-500' : ''}
                                />
                                {errors.src && (
                                    <p className="text-sm text-red-600 mt-1">{errors.src}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="number"
                                    min="1"
                                    value={data.position}
                                    onChange={(e) => setData('position', parseInt(e.target.value) || 1)}
                                    className={errors.position ? 'border-red-500' : ''}
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_primary"
                                checked={data.is_primary}
                                onChange={(e) => setData('is_primary', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="is_primary">Set as primary image</Label>
                        </div>
                        <Button type="submit" disabled={processing}>
                            <Image className="h-4 w-4 mr-2" />
                            {processing ? 'Adding...' : 'Add Image'}
                        </Button>
                    </form>
                </div>

                {/* Existing Images */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Current Images</h2>
                    {sortedImages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📷</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                            <p className="text-gray-600">Add your first image using the form above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedImages.map((image) => (
                                <div key={image.id} className="relative border rounded-lg overflow-hidden">
                                    <div className="aspect-square bg-gray-100">
                                        <img
                                            src={image.src}
                                            alt={`Product image ${image.position}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">
                                                Position: {image.position}
                                            </span>
                                            {image.is_primary && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {!image.is_primary && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleSetPrimary(image.id)}
                                                    className="flex-1"
                                                >
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Set Primary
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="flex-1"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Image Guidelines */}
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Image Guidelines</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use high-quality images with good lighting</li>
                        <li>• Recommended size: 800x800 pixels or larger</li>
                        <li>• Supported formats: JPG, PNG, WebP</li>
                        <li>• The primary image will be used as the main product image</li>
                        <li>• Position numbers determine the display order</li>
                    </ul>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
