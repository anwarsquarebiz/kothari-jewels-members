import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { type CatalogueProduct, type ClientVisitItem } from '@/types/client-visits';
import { ArrowDown, ArrowUp, Check, ImageIcon, ImagePlus, Loader2, PenLine, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    items: ClientVisitItem[];
    onChange: (items: ClientVisitItem[]) => void;
    errors?: Record<string, string>;
}

function ProductThumb({ src, className }: { src: string | null; className?: string }) {
    return src ? (
        <img src={src} alt="" className={cn('h-10 w-10 rounded border object-cover', className)} />
    ) : (
        <div className={cn('bg-muted flex h-10 w-10 items-center justify-center rounded border', className)}>
            <ImageIcon className="text-muted-foreground h-4 w-4" />
        </div>
    );
}

function manualImageSrc(item: ClientVisitItem): string | null {
    if (item.remove_image) {
        return null;
    }

    return item.image_preview || item.image || null;
}

function ManualImageField({
    item,
    inputId,
    onSelect,
    onClear,
}: {
    item: ClientVisitItem;
    inputId: string;
    onSelect: (file: File) => void;
    onClear: () => void;
}) {
    const src = manualImageSrc(item);

    return (
        <div className="flex h-9 shrink-0 items-center gap-1">
            <label
                htmlFor={inputId}
                className="border-input bg-background hover:bg-accent flex h-9 cursor-pointer items-center gap-2 border px-2.5 shadow-xs transition-colors"
            >
                {src ? (
                    <img src={src} alt="" className="h-6 w-6 object-cover" />
                ) : (
                    <ImagePlus className="text-muted-foreground h-4 w-4" />
                )}
                <span className="text-muted-foreground text-sm whitespace-nowrap">{src ? 'Change image' : 'Upload image'}</span>
                <input
                    id={inputId}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            onSelect(file);
                        }
                        event.target.value = '';
                    }}
                />
            </label>
            {src && (
                <button
                    type="button"
                    onClick={onClear}
                    className="border-input bg-background hover:bg-accent flex h-9 w-9 items-center justify-center border shadow-xs"
                    aria-label="Remove image"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function useProductSearch(query: string) {
    const [results, setResults] = useState<CatalogueProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const term = query.trim();
        if (term === '') {
            setResults([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        const timer = window.setTimeout(() => {
            fetch(`/admin/client-visits/product-search?q=${encodeURIComponent(term)}`, {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
                signal: controller.signal,
            })
                .then((response) => (response.ok ? response.json() : { data: [] }))
                .then((json: { data: CatalogueProduct[] }) => setResults(json.data ?? []))
                .catch((error: unknown) => {
                    if (!(error instanceof DOMException && error.name === 'AbortError')) {
                        setResults([]);
                    }
                })
                .finally(() => {
                    if (!controller.signal.aborted) {
                        setLoading(false);
                    }
                });
        }, 300);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return { results, loading };
}

export default function ProductPicker({ items, onChange, errors = {} }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { results, loading } = useProductSearch(query);
    const manualInputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    useEffect(() => {
        if (focusIndex !== null) {
            manualInputRefs.current[focusIndex]?.focus();
            setFocusIndex(null);
        }
    }, [focusIndex]);

    const selectedIds = new Set(items.filter((item) => item.product_id).map((item) => item.product_id));

    const toggleProduct = (product: CatalogueProduct) => {
        if (selectedIds.has(product.id)) {
            onChange(items.filter((item) => item.product_id !== product.id));
            return;
        }

        onChange([...items, { product_id: product.id, stock_code: null, notes: null, product }]);
    };

    const addManual = () => {
        onChange([...items, { product_id: null, stock_code: '', notes: null, image: null, image_file: null, product: null }]);
        setFocusIndex(items.length);
    };

    const releasePreview = (item: ClientVisitItem) => {
        if (item.image_preview?.startsWith('blob:')) {
            URL.revokeObjectURL(item.image_preview);
        }
    };

    const setManualImage = (index: number, file: File) => {
        const current = items[index];
        releasePreview(current);
        updateItem(index, {
            image_file: file,
            image_preview: URL.createObjectURL(file),
            remove_image: false,
        });
    };

    const clearManualImage = (index: number) => {
        const current = items[index];
        releasePreview(current);
        updateItem(index, {
            image_file: null,
            image_preview: null,
            remove_image: true,
        });
    };

    const updateItem = (index: number, patch: Partial<ClientVisitItem>) => {
        onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    };

    const removeItem = (index: number) => {
        releasePreview(items[index]);
        onChange(items.filter((_, i) => i !== index));
    };

    const moveItem = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= items.length) {
            return;
        }
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="text-muted-foreground flex-1 justify-start font-normal">
                            <Search className="mr-2 h-4 w-4" />
                            Search catalogue by SKU, title or category...
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) min-w-[320px] p-0" align="start">
                        <Command shouldFilter={false}>
                            <CommandInput placeholder="Type SKU, title or category..." value={query} onValueChange={setQuery} />
                            <CommandList className="max-h-[360px]">
                                {loading && (
                                    <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Searching...
                                    </div>
                                )}
                                {!loading && query.trim() === '' && (
                                    <div className="text-muted-foreground py-6 text-center text-sm">Start typing to search the catalogue.</div>
                                )}
                                {!loading && query.trim() !== '' && <CommandEmpty>No products found.</CommandEmpty>}
                                {!loading && results.length > 0 && (
                                    <CommandGroup heading={`${results.length} result${results.length === 1 ? '' : 's'}`}>
                                        {results.map((product) => {
                                            const selected = selectedIds.has(product.id);
                                            return (
                                                <CommandItem
                                                    key={product.id}
                                                    value={String(product.id)}
                                                    onSelect={() => toggleProduct(product)}
                                                    className="gap-3 py-2"
                                                >
                                                    <ProductThumb src={product.image} />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-medium">{product.title}</div>
                                                        <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                                                            <span className="font-mono">{product.sku}</span>
                                                            {product.categories.slice(0, 3).map((category) => (
                                                                <span key={category.id} className="bg-muted rounded px-1.5 py-0.5">
                                                                    {category.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Check className={cn('h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button type="button" variant="outline" onClick={addManual}>
                    <PenLine className="mr-2 h-4 w-4" />
                    Add manual stock code
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                    No pieces added yet. Search the catalogue or add a stock code manually.
                </div>
            ) : (
                <ol className="space-y-2">
                    {items.map((item, index) => {
                        const error = errors[`items.${index}.stock_code`] ?? errors[`items.${index}.product_id`];
                        const imageError = errors[`items.${index}.image`];
                        return (
                            <li key={item.product_id ? `p-${item.product_id}` : `m-${index}`} className="rounded-lg border p-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-muted-foreground w-6 pt-2.5 text-xs font-semibold tabular-nums">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {item.product ? (
                                        <>
                                            <ProductThumb src={item.product.image} className="h-12 w-12" />
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div>
                                                    <div className="truncate font-medium">{item.product.title}</div>
                                                    <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                                                        <span className="font-mono">{item.product.sku}</span>
                                                        {item.product.categories.slice(0, 3).map((category) => (
                                                            <span key={category.id} className="bg-muted rounded px-1.5 py-0.5">
                                                                {category.name}
                                                            </span>
                                                        ))}
                                                        {item.product.price && <span>· {item.product.price}</span>}
                                                    </div>
                                                </div>
                                                <Input
                                                    value={item.notes ?? ''}
                                                    onChange={(e) => updateItem(index, { notes: e.target.value })}
                                                    placeholder="Note (optional) — size, metal, client reaction..."
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <ManualImageField
                                                    item={item}
                                                    inputId={`manual-image-${index}`}
                                                    onSelect={(file) => setManualImage(index, file)}
                                                    onClear={() => clearManualImage(index)}
                                                />
                                                <Input
                                                    ref={(el) => {
                                                        manualInputRefs.current[index] = el;
                                                    }}
                                                    value={item.stock_code ?? ''}
                                                    onChange={(e) => updateItem(index, { stock_code: e.target.value })}
                                                    placeholder="Label / Stock Code"
                                                    className={cn('h-9 font-mono sm:min-w-0 sm:flex-1', error && 'border-red-500')}
                                                />
                                            </div>
                                            <Input
                                                value={item.notes ?? ''}
                                                onChange={(e) => updateItem(index, { notes: e.target.value })}
                                                placeholder="Note (optional)"
                                                className="h-8 text-sm"
                                            />
                                            {error && <p className="text-sm text-red-600">{error}</p>}
                                            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
                                        </div>
                                    )}
                                    <div className="flex shrink-0 items-center gap-0.5">
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => moveItem(index, -1)} aria-label="Move up">
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={index === items.length - 1}
                                            onClick={() => moveItem(index, 1)}
                                            aria-label="Move down"
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(index)} aria-label="Remove piece">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}

            {items.length > 0 && (
                <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add another piece
                </Button>
            )}
        </div>
    );
}
