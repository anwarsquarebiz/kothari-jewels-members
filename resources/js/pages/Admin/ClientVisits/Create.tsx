import ClientVisitForm from '@/components/client-visits/ClientVisitForm';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ClientVisitOptions } from '@/types/client-visits';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    options: ClientVisitOptions;
    defaults: {
        attended_by: string;
        visit_date: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Client Visits', href: '/admin/client-visits' },
    { title: 'New Visit', href: '/admin/client-visits/create' },
];

export default function Create({ options, defaults }: Props) {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="New Client Visit" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Client Visit Summary</h1>
                        <p className="text-muted-foreground">Post-appointment record for an in-store client visit.</p>
                    </div>
                    <Link href="/admin/client-visits">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <ClientVisitForm
                    options={options}
                    action="/admin/client-visits"
                    method="post"
                    submitLabel="Save Visit"
                    cancelHref="/admin/client-visits"
                    initialData={{
                        client_name: '',
                        client_phone: '',
                        client_email: '',
                        visit_date: defaults.visit_date,
                        attended_by: defaults.attended_by,
                        source: '',
                        source_details: '',
                        purpose: '',
                        occasion_details: '',
                        buying_intent: '',
                        product_preference: '',
                        budget: '',
                        summary: '',
                        next_steps: '',
                        follow_up_date: '',
                        follow_up_by: '',
                        items: [],
                    }}
                />
            </div>
        </AppSidebarLayout>
    );
}
