import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { followUpBadgeClass, followUpStatus, formatDisplayDate, intentBadgeClass } from '@/lib/client-visits';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type ClientVisitListItem, type ClientVisitOptions } from '@/types/client-visits';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, FileDown, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Filters {
    search?: string;
    date_from?: string;
    date_to?: string;
    source?: string;
    buying_intent?: string;
    follow_up?: string;
}

interface Props {
    visits: Paginated<ClientVisitListItem>;
    filters: Filters;
    options: ClientVisitOptions;
    stats: {
        total: number;
        this_month: number;
        serious: number;
        follow_ups_due: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Client Visits', href: '/admin/client-visits' },
];

const ALL = 'all';

export default function Index({ visits, filters, options, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [source, setSource] = useState(filters.source || ALL);
    const [intent, setIntent] = useState(filters.buying_intent || ALL);
    const [followUp, setFollowUp] = useState(filters.follow_up || ALL);

    const applyFilters = (overrides: Partial<Filters> = {}) => {
        const params: Filters = {
            search,
            date_from: dateFrom,
            date_to: dateTo,
            source: source === ALL ? '' : source,
            buying_intent: intent === ALL ? '' : intent,
            follow_up: followUp === ALL ? '' : followUp,
            ...overrides,
        };

        router.get(
            '/admin/client-visits',
            Object.fromEntries(Object.entries(params).filter(([, value]) => value)),
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        setSource(ALL);
        setIntent(ALL);
        setFollowUp(ALL);
        router.get('/admin/client-visits', {}, { preserveState: true, replace: true });
    };

    const hasFilters = Object.values(filters).some(Boolean);

    const statCards = [
        { label: 'Total visits', value: stats.total },
        { label: 'This month', value: stats.this_month },
        { label: 'Serious buyers', value: stats.serious },
        {
            label: 'Follow-ups due',
            value: stats.follow_ups_due,
            onClick: () => {
                setFollowUp('due');
                applyFilters({ follow_up: 'due' });
            },
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Visits" />

            <div className="space-y-6 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Client Visits</h1>
                        <p className="text-muted-foreground">In-store visit summaries and leads</p>
                    </div>
                    <Link href="/admin/client-visits/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Visit
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <button
                            key={card.label}
                            type="button"
                            onClick={card.onClick}
                            disabled={!card.onClick}
                            className={cn('rounded-xl border p-4 text-left', card.onClick && 'hover:bg-accent/50 cursor-pointer transition-colors')}
                        >
                            <div className="text-muted-foreground text-xs tracking-wide uppercase">{card.label}</div>
                            <div className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">
                    <div className="lg:col-span-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Client, phone, email, staff..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>
                    <div>
                        <Label htmlFor="date_from">From</Label>
                        <Input id="date_from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="date_to">To</Label>
                        <Input id="date_to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                    <div>
                        <Label>Source</Label>
                        <Select value={source} onValueChange={setSource}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All sources</SelectItem>
                                {options.sources.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Buying intent</Label>
                        <Select value={intent} onValueChange={setIntent}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All</SelectItem>
                                {options.buying_intents.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Follow-up</Label>
                        <Select value={followUp} onValueChange={setFollowUp}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>Any</SelectItem>
                                <SelectItem value="due">Due / overdue</SelectItem>
                                <SelectItem value="upcoming">Next 7 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    {hasFilters && (
                        <Button variant="ghost" onClick={clearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => applyFilters()}>
                        <Search className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                <div className="border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Visit date</TableHead>
                                <TableHead>Attended by</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Intent</TableHead>
                                <TableHead>Budget</TableHead>
                                <TableHead>Pieces</TableHead>
                                <TableHead>Follow-up</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visits.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-muted-foreground py-10 text-center">
                                        {hasFilters ? 'No visits match these filters.' : 'No client visits recorded yet.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {visits.data.map((visit) => {
                                const status = followUpStatus(visit.follow_up_date);
                                return (
                                    <TableRow key={visit.id}>
                                        <TableCell>
                                            <Link href={`/admin/client-visits/${visit.id}`} className="font-medium underline">
                                                {visit.client_name}
                                            </Link>
                                            {visit.client_phone && <div className="text-muted-foreground text-xs">{visit.client_phone}</div>}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{formatDisplayDate(visit.visit_date)}</TableCell>
                                        <TableCell>{visit.attended_by}</TableCell>
                                        <TableCell>{visit.source_label}</TableCell>
                                        <TableCell>
                                            <span className={cn('rounded px-2 py-1 text-xs whitespace-nowrap', intentBadgeClass[visit.buying_intent])}>
                                                {visit.buying_intent_label.split(' / ')[0]}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">{visit.budget || '—'}</TableCell>
                                        <TableCell className="text-sm tabular-nums">{visit.items_count}</TableCell>
                                        <TableCell>
                                            {visit.follow_up_date ? (
                                                <div>
                                                    <span className={cn('rounded px-2 py-1 text-xs whitespace-nowrap', followUpBadgeClass[status])}>
                                                        {formatDisplayDate(visit.follow_up_date)}
                                                    </span>
                                                    {visit.follow_up_by && <div className="text-muted-foreground mt-1 text-xs">{visit.follow_up_by}</div>}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/client-visits/${visit.id}`}>
                                                    <Button variant="ghost" size="sm" title="View">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/client-visits/${visit.id}/edit`}>
                                                    <Button variant="ghost" size="sm" title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <a href={`/admin/client-visits/${visit.id}/pdf`}>
                                                    <Button variant="ghost" size="sm" title="Download PDF">
                                                        <FileDown className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="Delete"
                                                    onClick={() => {
                                                        if (confirm(`Delete the visit record for ${visit.client_name}?`)) {
                                                            router.delete(`/admin/client-visits/${visit.id}`, { preserveScroll: true });
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

                {visits.last_page > 1 && <Pagination links={visits.links} meta={visits} />}
            </div>
        </AppSidebarLayout>
    );
}
