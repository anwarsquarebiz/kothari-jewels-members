import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronRight,
    ExternalLink,
    Eye,
    Layers,
    MoveDown,
    MoveUp,
    Plus,
    Save,
    Search,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ShowcaseProduct {
    id: number;
    title: string;
    slug: string;
    sku: string;
    price: number;
    currency: string;
    formatted_price: string;
    primary_image_url: string | null;
    show_in_landing_rail: boolean;
    rail_position: number;
    show_in_landing_jewellery: boolean;
    jewellery_position: number;
    landing_stones: string[];
    is_landing_feature: boolean;
    landing_feature_bg: string | null;
    categories: Category[];
}

interface StoneOption {
    key: string;
    label: string;
    color: string;
}

interface ColorOption {
    name: string;
    value: string;
}

interface Props {
    railProducts: ShowcaseProduct[];
    jewelleryProducts: ShowcaseProduct[];
    allProducts: ShowcaseProduct[];
    categories: Category[];
    stoneOptions: StoneOption[];
    featureColorOptions: ColorOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Landing Showcase',
        href: '/admin/landing-showcase',
    },
];

export default function LandingShowcaseIndex({
    railProducts: initialRail,
    jewelleryProducts: initialJewellery,
    allProducts,
    categories,
    stoneOptions,
    featureColorOptions,
}: Props) {
    const [activeTab, setActiveTab] = useState<'rail' | 'jewellery'>('rail');

    // Rail state
    const [railItems, setRailItems] = useState<ShowcaseProduct[]>(initialRail);
    const [isSavingRail, setIsSavingRail] = useState(false);

    // Jewellery state
    const [jewelleryItems, setJewelleryItems] = useState<ShowcaseProduct[]>(initialJewellery);
    const [isSavingJewellery, setIsSavingJewellery] = useState(false);

    // Add Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalTarget, setModalTarget] = useState<'rail' | 'jewellery'>('rail');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

    // -------------------------------------------------------------
    // Image resolution helper
    // -------------------------------------------------------------
    const formatImageSrc = (src: string | null) => {
        if (!src) return '/media/brand/placeholder.png';
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
            return src;
        }
        return `/${src}`;
    };

    // -------------------------------------------------------------
    // Rail Ordering Actions
    // -------------------------------------------------------------
    const moveRailItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= railItems.length) return;

        const updated = [...railItems];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        // Re-index positions
        const reindexed = updated.map((item, idx) => ({
            ...item,
            rail_position: idx + 1,
        }));
        setRailItems(reindexed);
    };

    const removeRailItem = (id: number) => {
        const filtered = railItems.filter((item) => item.id !== id);
        const reindexed = filtered.map((item, idx) => ({
            ...item,
            rail_position: idx + 1,
        }));
        setRailItems(reindexed);
    };

    const saveRail = () => {
        setIsSavingRail(true);
        router.post(
            '/admin/landing-showcase/rail',
            {
                product_ids: railItems.map((p) => p.id),
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSavingRail(false),
            }
        );
    };

    // -------------------------------------------------------------
    // Jewellery Ordering and Customization Actions
    // -------------------------------------------------------------
    const moveJewelleryItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= jewelleryItems.length) return;

        const updated = [...jewelleryItems];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        const reindexed = updated.map((item, idx) => ({
            ...item,
            jewellery_position: idx + 1,
        }));
        setJewelleryItems(reindexed);
    };

    const removeJewelleryItem = (id: number) => {
        const filtered = jewelleryItems.filter((item) => item.id !== id);
        const reindexed = filtered.map((item, idx) => ({
            ...item,
            jewellery_position: idx + 1,
        }));
        setJewelleryItems(reindexed);
    };

    const toggleStoneForJewelleryItem = (productId: number, stoneKey: string) => {
        setJewelleryItems((prev) =>
            prev.map((item) => {
                if (item.id !== productId) return item;
                const currentStones = item.landing_stones || [];
                const hasStone = currentStones.includes(stoneKey);
                const nextStones = hasStone
                    ? currentStones.filter((s) => s !== stoneKey)
                    : [...currentStones, stoneKey];
                return {
                    ...item,
                    landing_stones: nextStones.length > 0 ? nextStones : ['diamond'],
                };
            })
        );
    };

    const toggleFeatureCard = (productId: number, isFeature: boolean) => {
        setJewelleryItems((prev) =>
            prev.map((item) => {
                if (item.id !== productId) return item;
                return {
                    ...item,
                    is_landing_feature: isFeature,
                    landing_feature_bg: isFeature
                        ? item.landing_feature_bg || featureColorOptions[0].value
                        : null,
                };
            })
        );
    };

    const updateFeatureBg = (productId: number, color: string) => {
        setJewelleryItems((prev) =>
            prev.map((item) => {
                if (item.id !== productId) return item;
                return {
                    ...item,
                    landing_feature_bg: color,
                };
            })
        );
    };

    const saveJewellery = () => {
        setIsSavingJewellery(true);
        const payload = jewelleryItems.map((item, idx) => ({
            id: item.id,
            position: idx + 1,
            landing_stones: item.landing_stones && item.landing_stones.length > 0 ? item.landing_stones : ['diamond'],
            is_landing_feature: Boolean(item.is_landing_feature),
            landing_feature_bg: item.is_landing_feature ? item.landing_feature_bg : null,
        }));

        router.post(
            '/admin/landing-showcase/jewellery',
            { items: payload },
            {
                preserveScroll: true,
                onFinish: () => setIsSavingJewellery(false),
            }
        );
    };

    // -------------------------------------------------------------
    // Add Product Modal Handler
    // -------------------------------------------------------------
    const openAddModal = (target: 'rail' | 'jewellery') => {
        setModalTarget(target);
        setSearchQuery('');
        setCategoryFilter('all');
        setSelectedProductIds([]);
        setIsAddModalOpen(true);
    };

    const currentExistingIds = modalTarget === 'rail'
        ? railItems.map((i) => i.id)
        : jewelleryItems.map((i) => i.id);

    const filteredAvailableProducts = allProducts.filter((product) => {
        const matchesQuery =
            !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat =
            categoryFilter === 'all' ||
            product.categories.some((c) => c.id.toString() === categoryFilter);

        return matchesQuery && matchesCat;
    });

    const handleConfirmAddProducts = () => {
        const toAdd = allProducts.filter((p) => selectedProductIds.includes(p.id));

        if (modalTarget === 'rail') {
            const newRail = [...railItems];
            toAdd.forEach((product) => {
                if (!newRail.some((p) => p.id === product.id)) {
                    newRail.push({
                        ...product,
                        show_in_landing_rail: true,
                        rail_position: newRail.length + 1,
                    });
                }
            });
            setRailItems(newRail);
        } else {
            const newJewellery = [...jewelleryItems];
            toAdd.forEach((product) => {
                if (!newJewellery.some((p) => p.id === product.id)) {
                    // Try to guess default stone from title
                    const titleLower = product.title.toLowerCase();
                    const detectedStone = stoneOptions.find((s) => titleLower.includes(s.key))?.key || 'diamond';
                    newJewellery.push({
                        ...product,
                        show_in_landing_jewellery: true,
                        jewellery_position: newJewellery.length + 1,
                        landing_stones: [detectedStone],
                        is_landing_feature: false,
                        landing_feature_bg: null,
                    });
                }
            });
            setJewelleryItems(newJewellery);
        }

        setIsAddModalOpen(false);
        setSelectedProductIds([]);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Landing Page Showcase Management" />

            <div className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#2a2526] pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-6 text-[#c9ae7e]" />
                            <h1 className="text-2xl font-semibold tracking-tight text-[#ede7d6]">
                                Landing Page Showcase
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-[#9b938f]">
                            Select and organize products from your sales inventory to feature dynamically on the boutique landing page.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-[#c9ae7e]/30 bg-[#1e1b1c] px-4 py-2 text-xs font-medium text-[#c9ae7e] transition hover:border-[#c9ae7e] hover:bg-[#282425]"
                        >
                            <span>Preview Boutique</span>
                            <ExternalLink className="size-3.5" />
                        </a>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'rail' | 'jewellery')} className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <TabsList className="bg-[#1e1b1c] border border-[#2e292a]">
                            <TabsTrigger
                                value="rail"
                                className="data-[state=active]:bg-[#2c2627] data-[state=active]:text-[#c9ae7e] text-[#b8b0a5]"
                            >
                                Selected Pieces (Homepage Rail) ({railItems.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="jewellery"
                                className="data-[state=active]:bg-[#2c2627] data-[state=active]:text-[#c9ae7e] text-[#b8b0a5]"
                            >
                                Jewellery Collection Page ({jewelleryItems.length})
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'rail' ? (
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={() => openAddModal('rail')}
                                    className="bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298] font-medium"
                                >
                                    <Plus className="mr-1.5 size-4" />
                                    Add Products to Rail
                                </Button>
                                <Button
                                    type="button"
                                    onClick={saveRail}
                                    disabled={isSavingRail}
                                    className="bg-[#2c2627] text-[#ede7d6] border border-[#c9ae7e]/40 hover:bg-[#383132]"
                                >
                                    <Save className="mr-1.5 size-4 text-[#c9ae7e]" />
                                    {isSavingRail ? 'Saving...' : 'Save Rail Order'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={() => openAddModal('jewellery')}
                                    className="bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298] font-medium"
                                >
                                    <Plus className="mr-1.5 size-4" />
                                    Add Products to Jewellery
                                </Button>
                                <Button
                                    type="button"
                                    onClick={saveJewellery}
                                    disabled={isSavingJewellery}
                                    className="bg-[#2c2627] text-[#ede7d6] border border-[#c9ae7e]/40 hover:bg-[#383132]"
                                >
                                    <Save className="mr-1.5 size-4 text-[#c9ae7e]" />
                                    {isSavingJewellery ? 'Saving...' : 'Save Showcase Changes'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ============================================================== */}
                    {/* TAB 1: SELECTED PIECES (RAIL) */}
                    {/* ============================================================== */}
                    <TabsContent value="rail" className="space-y-4">
                        <div className="rounded-lg border border-[#2a2526] bg-[#181617] p-4 text-xs text-[#b8b0a5] flex items-center justify-between">
                            <div>
                                <strong className="text-[#ede7d6]">Horizontal Boutique Rail:</strong> These pieces are showcased in the horizontal sliding showcase on the boutique landing page. Pieces are ordered from left to right as listed below.
                            </div>
                            <span className="text-[#c9ae7e] font-mono">{railItems.length} pieces curated</span>
                        </div>

                        {railItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#3a3435] bg-[#181617]/50 p-12 text-center">
                                <Layers className="mx-auto size-10 text-[#69615e]" />
                                <h3 className="mt-3 text-lg font-medium text-[#ede7d6]">No products added to rail</h3>
                                <p className="mt-1 text-sm text-[#9b938f]">
                                    Click "Add Products to Rail" to choose items from your sale catalog to feature in the landing page rail.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => openAddModal('rail')}
                                    className="mt-4 bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298]"
                                >
                                    <Plus className="mr-1.5 size-4" />
                                    Select Products
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {railItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg border border-[#2a2526] bg-[#1b191a] p-3 transition hover:border-[#3d3637]"
                                    >
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            {/* Reorder Arrows */}
                                            <div className="flex md:flex-col gap-1 items-center justify-center">
                                                <button
                                                    type="button"
                                                    disabled={index === 0}
                                                    onClick={() => moveRailItem(index, 'up')}
                                                    className="p-1 text-[#8c8480] hover:text-[#ede7d6] disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move Left/Earlier in Rail"
                                                >
                                                    <ArrowUp className="size-4" />
                                                </button>
                                                <span className="text-xs font-mono font-medium text-[#c9ae7e] px-1">
                                                    #{index + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={index === railItems.length - 1}
                                                    onClick={() => moveRailItem(index, 'down')}
                                                    className="p-1 text-[#8c8480] hover:text-[#ede7d6] disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move Right/Later in Rail"
                                                >
                                                    <ArrowDown className="size-4" />
                                                </button>
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="size-16 rounded-md bg-[#232021] border border-[#332e2f] overflow-hidden flex items-center justify-center shrink-0">
                                                <img
                                                    src={formatImageSrc(item.primary_image_url)}
                                                    alt={item.title}
                                                    className="size-full object-contain p-1"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="min-w-0">
                                                <h4 className="font-serif text-base font-medium text-[#ede7d6] truncate">
                                                    {item.title}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#9b938f]">
                                                    <span className="font-mono">{item.sku}</span>
                                                    <span>•</span>
                                                    <span className="text-[#c9ae7e] font-medium">
                                                        {item.formatted_price}
                                                    </span>
                                                    {item.categories.length > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="capitalize text-[#8a827d]">
                                                                {item.categories.map((c) => c.name).join(', ')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeRailItem(item.id)}
                                                className="text-[#994747] hover:bg-[#341d1d] hover:text-[#e06666]"
                                            >
                                                <Trash2 className="size-4 mr-1.5" />
                                                Remove from Rail
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {railItems.length > 0 && (
                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    onClick={saveRail}
                                    disabled={isSavingRail}
                                    className="bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298] font-medium"
                                >
                                    <Save className="mr-1.5 size-4" />
                                    {isSavingRail ? 'Saving Order...' : 'Save Rail Changes'}
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* ============================================================== */}
                    {/* TAB 2: JEWELLERY COLLECTION PAGE */}
                    {/* ============================================================== */}
                    <TabsContent value="jewellery" className="space-y-4">
                        <div className="rounded-lg border border-[#2a2526] bg-[#181617] p-4 text-xs text-[#b8b0a5] flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                            <div>
                                <strong className="text-[#ede7d6]">Jewellery Collection Grid:</strong> Configure each piece displayed when the visitor opens the Jewellery collection. Assign filter stone tags (e.g. Emerald, Ruby) so the boutique filter bar filters accurately, and optionally spotlight key pieces with bespoke 2x2 featured cards and rich background colors.
                            </div>
                            <span className="text-[#c9ae7e] font-mono shrink-0">{jewelleryItems.length} pieces configured</span>
                        </div>

                        {jewelleryItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#3a3435] bg-[#181617]/50 p-12 text-center">
                                <Layers className="mx-auto size-10 text-[#69615e]" />
                                <h3 className="mt-3 text-lg font-medium text-[#ede7d6]">No products added to jewellery collection</h3>
                                <p className="mt-1 text-sm text-[#9b938f]">
                                    Click "Add Products to Jewellery" to choose pieces to show in the boutique jewellery catalogue.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => openAddModal('jewellery')}
                                    className="mt-4 bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298]"
                                >
                                    <Plus className="mr-1.5 size-4" />
                                    Select Products
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {jewelleryItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border border-[#2a2526] bg-[#1b191a] p-4 transition hover:border-[#3d3637] space-y-4"
                                    >
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                            {/* Left: Reorder + Image + Title */}
                                            <div className="flex items-center gap-4 min-w-0">
                                                {/* Reorder Arrows */}
                                                <div className="flex lg:flex-col gap-1 items-center justify-center shrink-0">
                                                    <button
                                                        type="button"
                                                        disabled={index === 0}
                                                        onClick={() => moveJewelleryItem(index, 'up')}
                                                        className="p-1 text-[#8c8480] hover:text-[#ede7d6] disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Move Earlier in Grid"
                                                    >
                                                        <ArrowUp className="size-4" />
                                                    </button>
                                                    <span className="text-xs font-mono font-medium text-[#c9ae7e] px-1">
                                                        #{index + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={index === jewelleryItems.length - 1}
                                                        onClick={() => moveJewelleryItem(index, 'down')}
                                                        className="p-1 text-[#8c8480] hover:text-[#ede7d6] disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Move Later in Grid"
                                                    >
                                                        <ArrowDown className="size-4" />
                                                    </button>
                                                </div>

                                                {/* Thumbnail */}
                                                <div
                                                    className="size-20 rounded-md border border-[#332e2f] overflow-hidden flex items-center justify-center shrink-0 relative"
                                                    style={{
                                                        background: item.is_landing_feature && item.landing_feature_bg
                                                            ? item.landing_feature_bg
                                                            : '#232021',
                                                    }}
                                                >
                                                    <img
                                                        src={formatImageSrc(item.primary_image_url)}
                                                        alt={item.title}
                                                        className="size-full object-contain p-2"
                                                    />
                                                    {item.is_landing_feature && (
                                                        <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase tracking-wider bg-[#c9ae7e] text-[#141213] px-1 rounded">
                                                            2x2
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Title & info */}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-serif text-base font-medium text-[#ede7d6] truncate">
                                                            {item.title}
                                                        </h4>
                                                        {item.is_landing_feature && (
                                                            <Badge className="bg-[#c9ae7e]/20 text-[#c9ae7e] border border-[#c9ae7e]/40 text-[10px]">
                                                                Spotlight Card
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#9b938f]">
                                                        <span className="font-mono">{item.sku}</span>
                                                        <span>•</span>
                                                        <span className="text-[#c9ae7e] font-medium">{item.formatted_price}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Quick Remove */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeJewelleryItem(item.id)}
                                                    className="text-[#994747] hover:bg-[#341d1d] hover:text-[#e06666]"
                                                >
                                                    <Trash2 className="size-4 mr-1.5" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Configuration Row: Stones + 2x2 Feature */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#252122] text-xs">
                                            {/* Stone categories */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-[#b8b0a5] font-medium">
                                                    Filter Stones (determines stone tabs filter)
                                                </Label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {stoneOptions.map((st) => {
                                                        const isSelected = (item.landing_stones || []).includes(st.key);
                                                        return (
                                                            <button
                                                                key={st.key}
                                                                type="button"
                                                                onClick={() => toggleStoneForJewelleryItem(item.id, st.key)}
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition text-xs ${isSelected
                                                                    ? 'bg-[#292425] border-[#c9ae7e] text-[#ede7d6]'
                                                                    : 'bg-[#181617] border-[#312b2c] text-[#7d7572] hover:border-[#4d4446]'
                                                                    }`}
                                                            >
                                                                <span
                                                                    className="size-2 rounded-full border border-black/30"
                                                                    style={{ background: st.color }}
                                                                />
                                                                <span>{st.label}</span>
                                                                {isSelected && <Check className="size-3 text-[#c9ae7e]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Feature Spotlight Card Switch & Color */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor={`feature-${item.id}`} className="text-xs text-[#b8b0a5] font-medium cursor-pointer">
                                                        Spotlight Large Feature Card (2x2 Grid)
                                                    </Label>
                                                    <Switch
                                                        id={`feature-${item.id}`}
                                                        checked={item.is_landing_feature}
                                                        onCheckedChange={(checked) => toggleFeatureCard(item.id, checked)}
                                                    />
                                                </div>

                                                {item.is_landing_feature && (
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <span className="text-[11px] text-[#8a827d]">Tile Color:</span>
                                                        <div className="flex items-center gap-1.5">
                                                            {featureColorOptions.map((opt) => (
                                                                <button
                                                                    key={opt.value}
                                                                    type="button"
                                                                    onClick={() => updateFeatureBg(item.id, opt.value)}
                                                                    className={`size-6 rounded-md border transition flex items-center justify-center ${item.landing_feature_bg === opt.value
                                                                        ? 'border-[#c9ae7e] ring-1 ring-[#c9ae7e]'
                                                                        : 'border-[#332e2f] hover:border-[#554c4e]'
                                                                        }`}
                                                                    style={{ background: opt.value }}
                                                                    title={opt.name}
                                                                >
                                                                    {item.landing_feature_bg === opt.value && (
                                                                        <Check className="size-3 text-white drop-shadow" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            value={item.landing_feature_bg || ''}
                                                            onChange={(e) => updateFeatureBg(item.id, e.target.value)}
                                                            placeholder="#540C1F"
                                                            className="h-7 w-24 text-xs font-mono bg-[#141213] border-[#312b2c] text-[#ede7d6]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {jewelleryItems.length > 0 && (
                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    onClick={saveJewellery}
                                    disabled={isSavingJewellery}
                                    className="bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298] font-medium"
                                >
                                    <Save className="mr-1.5 size-4" />
                                    {isSavingJewellery ? 'Saving Changes...' : 'Save Jewellery Showcase'}
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* ============================================================== */}
            {/* ADD PRODUCT MODAL */}
            {/* ============================================================== */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-3xl bg-[#181617] border-[#2e292a] text-[#ede7d6] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-serif text-[#ede7d6]">
                            {modalTarget === 'rail'
                                ? 'Add Products to Homepage Rail'
                                : 'Add Products to Jewellery Collection'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#9b938f]">
                            Select active products from your inventory to include in this section.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 size-4 text-[#736a67]" />
                            <Input
                                type="text"
                                placeholder="Search by title or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-[#1e1b1c] border-[#312b2c] text-[#ede7d6] placeholder:text-[#6a625f]"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-48 bg-[#1e1b1c] border-[#312b2c] text-[#ede7d6]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e1b1c] border-[#312b2c] text-[#ede7d6]">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh] scrollbar-thin">
                        {filteredAvailableProducts.length === 0 ? (
                            <div className="py-12 text-center text-sm text-[#736a67]">
                                No products found matching your search.
                            </div>
                        ) : (
                            filteredAvailableProducts.map((product) => {
                                const isAlreadyIn = currentExistingIds.includes(product.id);
                                const isSelected = selectedProductIds.includes(product.id);

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => {
                                            if (isAlreadyIn) return;
                                            setSelectedProductIds((prev) =>
                                                isSelected
                                                    ? prev.filter((id) => id !== product.id)
                                                    : [...prev, product.id]
                                            );
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer ${isAlreadyIn
                                            ? 'opacity-50 bg-[#141213] border-[#221e1f] cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-[#262021] border-[#c9ae7e]'
                                                : 'bg-[#1b191a] border-[#2a2526] hover:border-[#3d3637]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Checkbox
                                                checked={isAlreadyIn || isSelected}
                                                disabled={isAlreadyIn}
                                                onCheckedChange={() => {
                                                    if (isAlreadyIn) return;
                                                    setSelectedProductIds((prev) =>
                                                        isSelected
                                                            ? prev.filter((id) => id !== product.id)
                                                            : [...prev, product.id]
                                                    );
                                                }}
                                            />
                                            <div className="size-12 rounded bg-[#232021] border border-[#332e2f] overflow-hidden flex items-center justify-center shrink-0">
                                                <img
                                                    src={formatImageSrc(product.primary_image_url)}
                                                    alt={product.title}
                                                    className="size-full object-contain p-1"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[#ede7d6] truncate font-serif">
                                                    {product.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-[#8c8480]">
                                                    <span className="font-mono">{product.sku}</span>
                                                    <span>•</span>
                                                    <span className="text-[#c9ae7e]">{product.formatted_price}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {isAlreadyIn && (
                                            <Badge variant="outline" className="text-[10px] border-[#3a3435] text-[#736a67]">
                                                Already Added
                                            </Badge>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <DialogFooter className="flex items-center justify-between gap-3 border-t border-[#2a2526] pt-3">
                        <span className="text-xs text-[#8c8480]">
                            {selectedProductIds.length} product(s) selected
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddModalOpen(false)}
                                className="border-[#332e2f] bg-transparent text-[#b8b0a5] hover:bg-[#232021]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirmAddProducts}
                                disabled={selectedProductIds.length === 0}
                                className="bg-[#c9ae7e] text-[#141213] hover:bg-[#d8c298] font-medium"
                            >
                                Add {selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : ''} to {modalTarget === 'rail' ? 'Rail' : 'Jewellery'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}

