import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDisplayDate, fromDateString, toDateString } from '@/lib/client-visits';
import { cn } from '@/lib/utils';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    invalid?: boolean;
    clearable?: boolean;
}

export default function DatePicker({ id, value, onChange, placeholder = 'Select date', invalid, clearable }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative">
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !value && 'text-muted-foreground',
                            invalid && 'border-red-500',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? formatDisplayDate(value) : placeholder}
                    </Button>
                </PopoverTrigger>
                {clearable && value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
                        aria-label="Clear date"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={fromDateString(value)}
                    defaultMonth={fromDateString(value)}
                    onSelect={(date) => {
                        onChange(toDateString(date));
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
