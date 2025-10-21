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
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Array<{
        name: string;
    }>;
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
    categories?: Category[];
    users_with_access?: User[];
}

interface Props {
    product: Product;
    categories: Category[];
    users: User[];
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
        title: 'Edit',
        href: '/admin/products/edit',
    },
];

export default function Edit({ product, categories, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: product.title,
        slug: product.slug,
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        sku: product.sku,
        currency: product.currency,
        price: product.price,
        categories: product.categories?.map(c => c.id) || [],
        user_access: product.users_with_access?.map(u => u.id) || [],
    });

    const [autoSlug, setAutoSlug] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    const handleTitleChange = (title: string) => {
        setData('title', title);
        if (autoSlug) {
            setData('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        if (checked) {
            setData('categories', [...data.categories, categoryId]);
        } else {
            setData('categories', data.categories.filter(id => id !== categoryId));
        }
    };

    const handleUserAccessChange = (userId: number, checked: boolean) => {
        if (checked) {
            setData('user_access', [...data.user_access, userId]);
        } else {
            setData('user_access', data.user_access.filter(id => id !== userId));
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product - ${product.title}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                        <p className="text-muted-foreground">
                            Update product: {product.title}
                        </p>
                    </div>
                    <Link href="/admin/products">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <div className="w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Product title"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div className="md:col-span-2">
                                <Label htmlFor="slug">Slug</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="product-slug"
                                        className={errors.slug ? 'border-red-500' : ''}
                                        disabled={autoSlug}
                                    />
                                    <div className="flex items-center w-[200px] space-x-2">
                                        <input
                                            type="checkbox"
                                            id="auto-slug"
                                            checked={autoSlug}
                                            onChange={(e) => setAutoSlug(e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="auto-slug" className="text-sm">
                                            Auto-generate
                                        </Label>
                                    </div>
                                </div>
                                {errors.slug && (
                                    <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="md:col-span-2">
                                <Label htmlFor="short_description">Short Description</Label>
                                <RichTextEditor
                                    value={data.short_description}
                                    onChange={(value) => setData('short_description', value)}
                                    placeholder="Brief product description"
                                    height={150}
                                    className={errors.short_description ? 'border-red-500' : ''}
                                />
                                {errors.short_description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.short_description}</p>
                                )}
                            </div>

                            {/* Long Description */}
                            <div className="md:col-span-2">
                                <Label htmlFor="long_description">Long Description</Label>
                                <RichTextEditor
                                    value={data.long_description}
                                    onChange={(value) => setData('long_description', value)}
                                    placeholder="Detailed product description"
                                    height={300}
                                    className={errors.long_description ? 'border-red-500' : ''}
                                />
                                {errors.long_description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.long_description}</p>
                                )}
                            </div>

                            {/* SKU */}
                            <div>
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    placeholder="Product SKU"
                                    className={errors.sku ? 'border-red-500' : ''}
                                />
                                {errors.sku && (
                                    <p className="text-sm text-red-600 mt-1">{errors.sku}</p>
                                )}
                            </div>

                            {/* Currency */}
                            <div>
                                <Label htmlFor="currency">Currency *</Label>
                                <Select
                                    value={data.currency}
                                    onValueChange={(value) => setData('currency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.currency && (
                                    <p className="text-sm text-red-600 mt-1">{errors.currency}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="md:col-span-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.price ? 'border-red-500' : ''}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="md:col-span-2">
                                <Label>Categories</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-4 border ">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                checked={data.categories.includes(category.id)}
                                                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                                className="rounded"
                                            />
                                            <Label htmlFor={`category-${category.id}`} className="text-sm">
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.categories && (
                                    <p className="text-sm text-red-600 mt-1">{errors.categories}</p>
                                )}
                            </div>

                            {/* User Access */}
                            <div className="md:col-span-2">
                                <Label>User Access</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 p-4 border  max-h-48 overflow-y-auto">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`user-${user.id}`}
                                                checked={data.user_access.includes(user.id)}
                                                onChange={(e) => handleUserAccessChange(user.id, e.target.checked)}
                                                className="rounded"
                                            />
                                            <Label htmlFor={`user-${user.id}`} className="text-sm">
                                                <div>
                                                    <div>{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.email}
                                                        {user.roles && user.roles.length > 0 && (
                                                            <span className="ml-1">
                                                                ({user.roles.map(r => r.name).join(', ')})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.user_access && (
                                    <p className="text-sm text-red-600 mt-1">{errors.user_access}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/products">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
