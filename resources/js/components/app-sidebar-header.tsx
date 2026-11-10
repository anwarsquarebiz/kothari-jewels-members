import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e3dccd] bg-[#faf8f3] px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-[#1a1718] hover:text-[#c9ae7e] hover:bg-[#ede7d6]" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <a
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#6a6158] hover:text-[#c9ae7e] transition-colors"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
                View Website ↗
            </a>
        </header>
    );
}
