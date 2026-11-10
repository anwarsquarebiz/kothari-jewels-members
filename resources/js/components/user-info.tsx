import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#c9ae7e]/40 shadow-xs">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-[#221e1f] text-[#c9ae7e] text-xs font-serif font-medium">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium text-[#ede7d6] text-[13px]">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-[11px] text-[#a39a8c]">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
