import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import InputError from '@/components/input-error';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { FormEvent } from 'react';

interface ImportMessage {
    sku: string | null;
    row: number | null;
    message: string;
}

interface ImportResult {
    created: number;
    updated: number;
    errors: ImportMessage[];
    warnings: ImportMessage[];
}

interface Props {
    result?: ImportResult | null;
    flashSuccess?: string | null;
    flashError?: string | null;
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
        title: 'Import',
        href: '/admin/products/import',
    },
];

export default function Import({ result, flashSuccess, flashError }: Props) {
    const { setData, post, processing, errors, progress } = useForm<{
        file: File | null;
        images_zip: File | null;
    }>({
        file: null,
        images_zip: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/products/import', {
            forceFormData: true,
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Products" />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Bulk import products</h1>
                        <p className="text-muted-foreground">
                            Upload Excel or CSV to create and update products by SKU.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/products">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to products
                            </Button>
                        </Link>
                        <a href="/admin/products/import/template">
                            <Button variant="outline" type="button">
                                <Download className="mr-2 h-4 w-4" />
                                Download template
                            </Button>
                        </a>
                        <a href="/admin/products/export">
                            <Button variant="outline" type="button">
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Export products
                            </Button>
                        </a>
                    </div>
                </div>

                {flashSuccess && (
                    <Alert>
                        <AlertTitle>Import complete</AlertTitle>
                        <AlertDescription>{flashSuccess}</AlertDescription>
                    </Alert>
                )}

                {flashError && (
                    <Alert variant="destructive">
                        <AlertTitle>Import failed</AlertTitle>
                        <AlertDescription>{flashError}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>How it works</CardTitle>
                        <CardDescription>
                            Existing SKUs are updated. Related details, images, and categories are replaced only when the file includes them.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            Excel workbooks should have <strong>products</strong>, <strong>details</strong>, and <strong>images</strong> sheets.
                            A single CSV is treated as the products sheet and may include an <code>images</code> column (comma-separated) and a <code>details</code> column (one per line: title | subtitle | image).
                        </p>
                        <p>
                            Images can be public https URLs, or filenames that match files in an images zip / <code>public/media/imports</code>.
                            Categories must already exist. Member access is optional via <code>user_emails</code>.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload file</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">Spreadsheet or zip</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.csv,.zip"
                                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.file} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="images_zip">Images zip (optional)</Label>
                                <Input
                                    id="images_zip"
                                    type="file"
                                    accept=".zip"
                                    onChange={(e) => setData('images_zip', e.target.files?.[0] ?? null)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Use this when the spreadsheet lists image filenames and the photos are in a separate zip.
                                </p>
                                <InputError message={errors.images_zip} />
                            </div>
                            {progress && (
                                <p className="text-sm text-muted-foreground">
                                    Uploading {progress.percentage}%
                                </p>
                            )}
                            <Button type="submit" disabled={processing}>
                                <Upload className="mr-2 h-4 w-4" />
                                {processing ? 'Importing...' : 'Import products'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {result && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Last import</CardTitle>
                            <CardDescription>
                                Created {result.created}, updated {result.updated}, {result.errors.length} errors, {result.warnings.length} warnings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {result.errors.length > 0 && (
                                <div>
                                    <h2 className="mb-2 font-medium">Errors</h2>
                                    <ResultTable rows={result.errors} />
                                </div>
                            )}
                            {result.warnings.length > 0 && (
                                <div>
                                    <h2 className="mb-2 font-medium">Warnings</h2>
                                    <ResultTable rows={result.warnings} />
                                </div>
                            )}
                            {result.errors.length === 0 && result.warnings.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    All rows imported without warnings.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppSidebarLayout>
    );
}

function ResultTable({ rows }: { rows: ImportMessage[] }) {
    return (
        <div className="border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={`${row.sku}-${row.row}-${index}`}>
                            <TableCell>{row.row ?? '—'}</TableCell>
                            <TableCell className="font-mono text-sm">{row.sku ?? '—'}</TableCell>
                            <TableCell>{row.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
