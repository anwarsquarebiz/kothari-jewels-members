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
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Image, Star, Trash2, Upload } from 'lucide-react';

interface ImageTagOption {
    value: string;
    label: string;
}

interface ProductImage {
    id: number;
    src: string;
    is_primary: boolean;
    position: number;
    tag: string | null;
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
    imageTags: ImageTagOption[];
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

function resolveImageSrc(src: string) {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }
    return `/${src}`;
}

const NONE_TAG = 'none';

export default function ManageImages({ product, imageTags }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        image: File | null;
        is_primary: boolean;
        position: number;
        tag: string;
    }>({
        image: null,
        is_primary: false,
        position: (product.images?.length || 0) + 1,
        tag: NONE_TAG,
    });

    const tagLabel = (value: string | null) =>
        imageTags.find((tag) => tag.value === value)?.label ?? null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}/images`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setData('position', (product.images?.length || 0) + 2);
                setData('is_primary', false);
                setData('image', null);
                setData('tag', NONE_TAG);
            },
        });
    };

    const handleTagChange = (imageId: number, tag: string) => {
        router.patch(
            `/admin/products/${product.id}/images/${imageId}/tag`,
            { tag: tag === NONE_TAG ? null : tag },
            { preserveScroll: true },
        );
    };

    const handleSetPrimary = (imageId: number) => {
        router.patch(`/admin/products/${product.id}/images/${imageId}/primary`);
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(`/admin/products/${product.id}/images/${imageId}`);
        }
    };

    const sortedImages = [...(product.images || [])].sort((a, b) => a.position - b.position);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage Images - ${product.title}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
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

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="image">Image file *</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={(e) =>
                                        setData('image', e.target.files?.[0] ?? null)
                                    }
                                    className={errors.image ? 'border-red-500' : ''}
                                />
                                {data.image && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Selected: {data.image.name}
                                    </p>
                                )}
                                {errors.image && (
                                    <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="number"
                                    min="1"
                                    value={data.position}
                                    onChange={(e) =>
                                        setData('position', parseInt(e.target.value) || 1)
                                    }
                                    className={errors.position ? 'border-red-500' : ''}
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="tag">Tag</Label>
                                <Select
                                    value={data.tag || NONE_TAG}
                                    onValueChange={(value) => setData('tag', value)}
                                >
                                    <SelectTrigger id="tag" className={errors.tag ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NONE_TAG}>None</SelectItem>
                                        {imageTags.map((tag) => (
                                            <SelectItem key={tag.value} value={tag.value}>
                                                {tag.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tag && (
                                    <p className="text-sm text-red-600 mt-1">{errors.tag}</p>
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
                        <Button type="submit" disabled={processing || !data.image}>
                            <Upload className="h-4 w-4 mr-2" />
                            {processing ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Current Images</h2>
                    {sortedImages.length === 0 ? (
                        <div className="text-center py-12">
                            <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No images uploaded
                            </h3>
                            <p className="text-gray-600">
                                Upload your first image using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative border rounded-lg overflow-hidden"
                                >
                                    <div className="aspect-square bg-gray-100">
                                        <img
                                            src={resolveImageSrc(image.src)}
                                            alt={`Product image ${image.position}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">
                                                Position: {image.position}
                                            </span>
                                            <div className="flex flex-wrap justify-end gap-1">
                                                {image.is_primary && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Primary
                                                    </span>
                                                )}
                                                {tagLabel(image.tag) && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {tagLabel(image.tag)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <Label htmlFor={`tag-${image.id}`} className="text-xs text-gray-600">
                                                Tag
                                            </Label>
                                            <Select
                                                value={image.tag || NONE_TAG}
                                                onValueChange={(value) => handleTagChange(image.id, value)}
                                            >
                                                <SelectTrigger id={`tag-${image.id}`} className="mt-1">
                                                    <SelectValue placeholder="None" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={NONE_TAG}>None</SelectItem>
                                                    {imageTags.map((tag) => (
                                                        <SelectItem key={tag.value} value={tag.value}>
                                                            {tag.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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

                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Image Guidelines</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• JPG, PNG, WebP, or GIF — max 5MB</li>
                        <li>• Recommended size: 800x800 pixels or larger</li>
                        <li>• The primary image is used as the main product image</li>
                        <li>• Position numbers determine the display order</li>
                        <li>• Tag an image as Price break up when it shows the price breakdown</li>
                    </ul>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
