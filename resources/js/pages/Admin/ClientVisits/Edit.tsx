import ClientVisitForm from '@/components/client-visits/ClientVisitForm';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ClientVisit, type ClientVisitOptions } from '@/types/client-visits';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    visit: ClientVisit;
    options: ClientVisitOptions;
}

export default function Edit({ visit, options }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Client Visits', href: '/admin/client-visits' },
        { title: visit.client_name, href: `/admin/client-visits/${visit.id}` },
        { title: 'Edit', href: `/admin/client-visits/${visit.id}/edit` },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Visit — ${visit.client_name}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Client Visit</h1>
                        <p className="text-muted-foreground">{visit.client_name}</p>
                    </div>
                    <Link href={`/admin/client-visits/${visit.id}`}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <ClientVisitForm
                    options={options}
                    action={`/admin/client-visits/${visit.id}`}
                    method="put"
                    submitLabel="Update Visit"
                    cancelHref={`/admin/client-visits/${visit.id}`}
                    initialData={{
                        client_name: visit.client_name,
                        client_phone: visit.client_phone ?? '',
                        client_email: visit.client_email ?? '',
                        visit_date: visit.visit_date,
                        attended_by: visit.attended_by,
                        source: visit.source,
                        source_details: visit.source_details ?? '',
                        purpose: visit.purpose,
                        occasion_details: visit.occasion_details ?? '',
                        buying_intent: visit.buying_intent,
                        product_preference: visit.product_preference,
                        budget: visit.budget ?? '',
                        summary: visit.summary ?? '',
                        next_steps: visit.next_steps ?? '',
                        follow_up_date: visit.follow_up_date ?? '',
                        follow_up_by: visit.follow_up_by ?? '',
                        items: visit.items.map((item) => ({
                            product_id: item.product_id,
                            stock_code: item.product_id ? null : (item.stock_code ?? ''),
                            notes: item.notes,
                            product: item.product,
                        })),
                    }}
                />
            </div>
        </AppSidebarLayout>
    );
}
