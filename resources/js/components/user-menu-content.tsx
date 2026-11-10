import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <div className="p-1 bg-[#1a1718] text-[#ede7d6] rounded-lg">
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm border-b border-[#2a2526]">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup className="py-1">
                <DropdownMenuItem asChild className="focus:bg-[#221e1f] focus:text-[#c9ae7e] cursor-pointer rounded-md">
                    <Link
                        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
                        href={edit()}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="size-4 text-[#c9ae7e]" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#2a2526] my-1" />
            <DropdownMenuItem asChild className="focus:bg-[#221e1f] focus:text-red-400 cursor-pointer rounded-md">
                <Link
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-400 hover:text-red-300"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </div>
    );
}
