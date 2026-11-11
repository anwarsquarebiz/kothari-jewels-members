import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ClipboardList,
    ExternalLink,
    LayoutGrid,
    Package,
    ShoppingBag,
    Tag,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Client Visits',
        href: '/admin/client-visits',
        icon: ClipboardList,
    },
    {
        title: 'Admin Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Member Catalogue',
        href: '/products',
        icon: ShoppingBag,
    },
    {
        title: 'Products Management',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Tag,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-[#2a2526] bg-[#141213] text-[#ede7d6]"
        >
            <SidebarHeader className="border-b border-[#2a2526] px-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-transparent hover:text-inherit active:bg-transparent"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-none">
                <NavMain items={mainNavItems} />

                {/* Quick Link to Landing Page */}
                <div className="mt-auto px-4 py-3 group-data-[collapsible=icon]:hidden">
                    <a
                        href="/"
                        className="flex items-center justify-between rounded-lg border border-[#c9ae7e]/20 bg-[#1b191a] px-3.5 py-2.5 text-xs text-[#cfc7b8] transition-colors hover:border-[#c9ae7e]/50 hover:bg-[#221e1f] hover:text-[#c9ae7e]"
                    >
                        <span
                            className="tracking-[0.16em] uppercase"
                            style={{ fontFamily: 'Cinzel, Georgia, serif' }}
                        >
                            Boutique Landing
                        </span>
                        <ExternalLink className="size-3.5 text-[#c9ae7e]" />
                    </a>
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-[#2a2526] p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
