import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-3">
            <SidebarGroupLabel
                className="text-[10px] tracking-[0.24em] uppercase text-[#c9ae7e] font-medium px-2 mb-1"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
                House & Platform
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={`rounded-md transition-all duration-200 px-3 py-2 text-sm ${
                                    isActive
                                        ? 'bg-[#221e1f] text-[#c9ae7e] font-medium border-l-2 border-[#c9ae7e] shadow-xs'
                                        : 'text-[#cfc7b8] hover:text-[#ede7d6] hover:bg-[#1e1b1c]'
                                }`}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon
                                            className={`size-4.5 transition-colors ${
                                                isActive ? 'text-[#c9ae7e]' : 'text-[#8f877a] group-hover:text-[#ede7d6]'
                                            }`}
                                        />
                                    )}
                                    <span className="tracking-wide text-[13px]">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
