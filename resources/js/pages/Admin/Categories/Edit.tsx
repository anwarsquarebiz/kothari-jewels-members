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
import { Switch } from '@/components/ui/switch';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    position: number;
    is_active: boolean;
}

interface ParentCategory {
    id: number;
    name: string;
}

interface Props {
    category: Category;
    parentCategories: ParentCategory[];
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
        title: 'Edit',
        href: '/admin/categories/edit',
    },
];

export default function Edit({ category, parentCategories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parent_id: category.parent_id || null as number | null,
        position: category.position,
        is_active: category.is_active,
    });

    const [autoSlug, setAutoSlug] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    const handleNameChange = (name: string) => {
        setData('name', name);
        if (autoSlug) {
            setData('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Category - ${category.name}`} />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Category</h1>
                        <p className="text-muted-foreground">
                            Update category: {category.name}
                        </p>
                    </div>
                    <Link href="/admin/categories">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Categories
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Category name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
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
                                        placeholder="category-slug"
                                        className={errors.slug ? 'border-red-500' : ''}
                                        disabled={autoSlug}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="auto-slug"
                                            checked={autoSlug}
                                            onCheckedChange={setAutoSlug}
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

                            {/* Description */}
                            <div className="md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Category description"
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Parent Category */}
                            <div>
                                <Label htmlFor="parent_id">Parent Category</Label>
                                <Select
                                    value={data.parent_id?.toString() || 'none'}
                                    onValueChange={(value) => setData('parent_id', value === 'none' ? null : parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select parent category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No parent (Root category)</SelectItem>
                                        {parentCategories.map((parentCategory) => (
                                            <SelectItem key={parentCategory.id} value={parentCategory.id.toString()}>
                                                {parentCategory.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.parent_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.parent_id}</p>
                                )}
                            </div>

                            {/* Position */}
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="number"
                                    min="0"
                                    value={data.position}
                                    onChange={(e) => setData('position', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className={errors.position ? 'border-red-500' : ''}
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                                {errors.is_active && (
                                    <p className="text-sm text-red-600 mt-1">{errors.is_active}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Link href="/admin/categories">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Updating...' : 'Update Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
