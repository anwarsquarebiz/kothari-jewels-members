import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { type PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, Image, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    src: string;
    is_primary: boolean;
    position: number;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    sku: string;
    currency: string;
    price: string;
    formatted_price: string;
    short_description?: string;
    categories?: Category[];
    images?: ProductImage[];
    images_count: number;
    details_count: number;
    users_with_access_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
    };
}

function resolveImageSrc(src: string) {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }

    return `/${src}`;
}

function primaryImageSrc(product: Product) {
    const image = product.images?.find((item) => item.is_primary) ?? product.images?.[0];

    return image ? resolveImageSrc(image.src) : null;
}

function formatPriceLakhs(price: string) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return '';
    }

    const lakhs = amount / 100000;
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(lakhs);

    return `${formatted}L`;
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
];

function csrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

function filenameFrom(disposition: string | null, fallback: string) {
    if (!disposition) {
        return fallback;
    }

    const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
    const raw = match?.[1] ?? match?.[2];

    return raw ? decodeURIComponent(raw) : fallback;
}

export default function Index({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [exporting, setExporting] = useState<'pdf' | 'image' | null>(null);

    const pageIds = products.data.map((product) => product.id);
    const pageKey = pageIds.join(',');
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    const someSelected = pageIds.some((id) => selectedIds.includes(id));

    useEffect(() => {
        setSelectedIds([]);
    }, [pageKey]);

    const downloadShare = async (format: 'pdf' | 'image') => {
        const ids = products.data
            .map((product) => product.id)
            .filter((id) => selectedIds.includes(id));

        if (ids.length === 0) {
            return;
        }

        setExporting(format);

        try {
            const response = await fetch('/admin/products/share-export', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json, application/pdf, image/jpeg',
                    'X-XSRF-TOKEN': csrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ ids, format }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                window.alert(data?.message ?? 'Export failed.');
                return;
            }

            const blob = await response.blob();
            const fallback = format === 'pdf' ? 'products-share.pdf' : 'products-share.jpg';
            const filename = filenameFrom(response.headers.get('Content-Disposition'), fallback);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            window.alert('Export failed.');
        } finally {
            setExporting(null);
        }
    };

    const handleSearch = () => {
        router.get('/admin/products', { 
            search, 
            category: category === 'all' ? '' : category, 
            min_price: minPrice,
            max_price: maxPrice 
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Products</h1>
                        <p className="text-muted-foreground">
                            Manage your products
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a href="/admin/products/import/template">
                            <Button variant="outline" type="button">
                                <Download className="h-4 w-4 mr-2" />
                                Template
                            </Button>
                        </a>
                        <a href="/admin/products/export">
                            <Button variant="outline" type="button">
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </a>
                        <Link href="/admin/products/import">
                            <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Import
                            </Button>
                        </Link>
                        <Link href="/admin/products/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="min_price">Min Price</Label>
                        <Input
                            id="min_price"
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="max_price">Max Price</Label>
                        <Input
                            id="max_price"
                            type="number"
                            placeholder="999999"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleSearch} variant="outline" className="w-full">
                            <Search className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3">
                        <p className="text-sm font-medium">
                            {selectedIds.length} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={exporting !== null}
                                onClick={() => downloadShare('pdf')}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={exporting !== null}
                                onClick={() => downloadShare('image')}
                            >
                                <Image className="h-4 w-4 mr-2" />
                                {exporting === 'image' ? 'Exporting...' : 'Export image'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className=" border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                                        onCheckedChange={(checked) => {
                                            setSelectedIds(checked === true ? pageIds : []);
                                        }}
                                        aria-label="Select all products on this page"
                                    />
                                </TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => {
                                const thumbnail = primaryImageSrc(product);

                                return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(product.id)}
                                            onCheckedChange={(checked) => {
                                                setSelectedIds((current) =>
                                                    checked === true
                                                        ? [...current, product.id]
                                                        : current.filter((id) => id !== product.id),
                                                );
                                            }}
                                            aria-label={`Select ${product.title}`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail}
                                                    alt=""
                                                    className="h-[3.9rem] w-[3.9rem] shrink-0 rounded border object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-[3.9rem] w-[3.9rem] shrink-0 items-center justify-center rounded border bg-gray-50 text-gray-300">
                                                    <Image className="h-5 w-5" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <div className="font-medium underline">{product.title}</div>
                                                </Link>
                                                <div className="text-sm text-muted-foreground">
                                                    {product.short_description}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatPriceLakhs(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {product.categories?.slice(0, 2).map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                            {(product.categories?.length || 0) > 2 && (
                                                <span className="text-xs text-muted-foreground">
                                                    +{(product.categories?.length || 0) - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/images`}>
                                                <Button variant="ghost" size="sm">
                                                    <Image className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this product?')) {
                                                        router.delete(`/admin/products/${product.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {products.links && (
                    <div className="flex justify-center">
                        <nav className="flex space-x-2">
                            {products.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
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
