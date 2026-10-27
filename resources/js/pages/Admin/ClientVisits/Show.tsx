import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { followUpBadgeClass, followUpStatus, formatDisplayDate, intentBadgeClass } from '@/lib/client-visits';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type ClientVisit } from '@/types/client-visits';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, FileDown, ImageIcon, Printer, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';

interface Props {
    visit: ClientVisit;
}

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
    return (
        <Card className="gap-4">
            <CardHeader>
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                    <span className="text-foreground">{number}</span> — {title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function Detail({ label, value, className, multiline }: { label: string; value: ReactNode; className?: string; multiline?: boolean }) {
    const empty = value === null || value === undefined || value === '';
    return (
        <div className={className}>
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">{label}</dt>
            <dd className={cn('mt-1', multiline && 'whitespace-pre-line', empty && 'text-muted-foreground')}>{empty ? '—' : value}</dd>
        </div>
    );
}

export default function Show({ visit }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Client Visits', href: '/admin/client-visits' },
        { title: visit.client_name, href: `/admin/client-visits/${visit.id}` },
    ];

    const status = followUpStatus(visit.follow_up_date);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Client Visit — ${visit.client_name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{visit.client_name}</h1>
                        <p className="text-muted-foreground text-sm">
                            Visited {formatDisplayDate(visit.visit_date)}
                            {visit.created_by && <> · Recorded by {visit.created_by}</>}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/client-visits">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <a href={`/admin/client-visits/${visit.id}/pdf?inline=1`} target="_blank" rel="noreferrer">
                            <Button variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                Preview PDF
                            </Button>
                        </a>
                        <a href={`/admin/client-visits/${visit.id}/pdf`}>
                            <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </a>
                        <Link href={`/admin/client-visits/${visit.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm(`Delete the visit record for ${visit.client_name}?`)) {
                                    router.delete(`/admin/client-visits/${visit.id}`);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Section number="01" title="Visit Details">
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <Detail label="Client Name" value={visit.client_name} />
                        <Detail label="Date of Visit" value={formatDisplayDate(visit.visit_date)} />
                        <Detail label="Phone" value={visit.client_phone && <a href={`tel:${visit.client_phone}`} className="underline">{visit.client_phone}</a>} />
                        <Detail label="Email" value={visit.client_email && <a href={`mailto:${visit.client_email}`} className="underline">{visit.client_email}</a>} />
                        <Detail label="Attended By" value={visit.attended_by} />
                        <Detail label="Source of Visit" value={visit.source_label} />
                        <Detail label="Referred By / Source Details" value={visit.source_details} className="sm:col-span-2" />
                    </dl>
                </Section>

                <Section number="02" title="Customer Profile & Buying Intent">
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <Detail label="Purpose of Visit" value={visit.purpose_label} />
                        <Detail label="Occasion & Date" value={visit.occasion_details} />
                        <Detail
                            label="Assessment of Buying Intent"
                            value={<span className={cn('rounded px-2 py-1 text-sm', intentBadgeClass[visit.buying_intent])}>{visit.buying_intent_label}</span>}
                        />
                        <Detail label="Product Preference" value={visit.product_preference_label} />
                        <Detail label="Budget / Price Range Discussed" value={visit.budget} className="sm:col-span-2" />
                    </dl>
                </Section>

                <Section number="03" title="Pieces of Interest">
                    {visit.items.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No pieces recorded.</p>
                    ) : (
                        <ol className="divide-y">
                            {visit.items.map((item, index) => {
                                const image = item.product?.image ?? item.image;

                                return (
                                <li key={item.id ?? index} className="flex items-center gap-4 py-3">
                                    <span className="text-muted-foreground w-6 text-xs font-semibold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                                    {image ? (
                                        <img src={image} alt="" className="h-14 w-14 rounded border object-cover" />
                                    ) : (
                                        <div className="bg-muted flex h-14 w-14 items-center justify-center rounded border">
                                            <ImageIcon className="text-muted-foreground h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        {item.product ? (
                                            <>
                                                <Link href={`/admin/products/${item.product.id}`} className="font-medium underline">
                                                    {item.product.title}
                                                </Link>
                                                <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                                                    <span className="font-mono">{item.product.sku}</span>
                                                    {item.product.categories.map((category) => (
                                                        <span key={category.id} className="bg-muted rounded px-1.5 py-0.5">
                                                            {category.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="font-mono font-medium">{item.stock_code}</div>
                                                <div className="text-muted-foreground text-xs">Manual entry</div>
                                            </>
                                        )}
                                        {item.notes && <div className="text-muted-foreground mt-1 text-sm">{item.notes}</div>}
                                    </div>
                                    {item.product?.price && <div className="text-sm whitespace-nowrap">{item.product.price}</div>}
                                </li>
                                );
                            })}
                        </ol>
                    )}
                </Section>

                <Section number="04" title="Outcome & Follow-up">
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <Detail label="Visit Summary / Important Observations" value={visit.summary} className="sm:col-span-2" multiline />
                        <Detail label="Next Steps / Action Required" value={visit.next_steps} className="sm:col-span-2" multiline />
                        <Detail
                            label="Follow-up Date"
                            value={
                                visit.follow_up_date && (
                                    <span className={cn('rounded px-2 py-1 text-sm', followUpBadgeClass[status])}>
                                        {formatDisplayDate(visit.follow_up_date)}
                                        {status === 'overdue' && ' · overdue'}
                                        {status === 'today' && ' · today'}
                                    </span>
                                )
                            }
                        />
                        <Detail label="Follow-up By" value={visit.follow_up_by} />
                    </dl>
                </Section>
            </div>
        </AppSidebarLayout>
    );
}
