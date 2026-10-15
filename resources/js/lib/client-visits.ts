import { format, isBefore, parseISO, startOfToday } from 'date-fns';

export function toDateString(date: Date | undefined): string {
    return date ? format(date, 'yyyy-MM-dd') : '';
}

export function fromDateString(value: string | null | undefined): Date | undefined {
    return value ? parseISO(value) : undefined;
}

export function formatDisplayDate(value: string | null | undefined): string {
    return value ? format(parseISO(value), 'dd MMM yyyy') : '—';
}

export type FollowUpStatus = 'overdue' | 'today' | 'upcoming' | 'none';

export function followUpStatus(value: string | null | undefined): FollowUpStatus {
    if (!value) {
        return 'none';
    }

    const date = parseISO(value);
    const today = startOfToday();

    if (isBefore(date, today)) {
        return 'overdue';
    }

    return date.getTime() === today.getTime() ? 'today' : 'upcoming';
}

export const intentBadgeClass: Record<string, string> = {
    serious: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    interested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    exploring: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export const followUpBadgeClass: Record<FollowUpStatus, string> = {
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    today: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    upcoming: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    none: 'text-muted-foreground',
};
