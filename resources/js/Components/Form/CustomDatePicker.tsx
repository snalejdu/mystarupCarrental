import React, { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { LuCalendar, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    parseISO,
    isBefore,
    startOfDay
} from 'date-fns';

export interface CustomDatePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    minDate?: string;
    placeholder?: string;
    className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    minDate,
    placeholder = 'Select date',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // Initialize currentMonth to the selected date or today
    const initialDate = value ? parseISO(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(initialDate);

    const minDateObj = minDate ? startOfDay(parseISO(minDate)) : undefined;
    const selectedDateObj = value ? parseISO(value) : undefined;

    const daysInMonth = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const handlePreviousMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateSelect = (day: Date) => {
        if (minDateObj && isBefore(startOfDay(day), minDateObj)) return;
        
        // Format to YYYY-MM-DD
        const formatted = format(day, 'yyyy-MM-dd');
        if (onChange) onChange(formatted);
        setIsOpen(false);
    };

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={`relative w-full flex items-center justify-between pl-8 pr-3 py-2.5 sm:py-2.5 rounded-xl sm:rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors shadow-xs ${className}`}
                >
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <LuCalendar className="h-3.5 w-3.5" />
                    </div>
                    <span className={value ? 'text-slate-800' : 'text-slate-400'}>
                        {value ? format(parseISO(value), 'MMM d, yyyy') : placeholder}
                    </span>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    align="center"
                    sideOffset={8}
                    collisionPadding={16}
                    avoidCollisions={true}
                    className="z-50 w-[260px] bg-white rounded-xl shadow-xl border border-slate-200 p-3 animate-in fade-in-80 slide-in-from-top-2"
                    style={{ colorScheme: 'light' }}
                >
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={handlePreviousMonth}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <LuChevronLeft className="w-4 h-4" />
                        </button>
                        <h2 className="text-sm font-bold text-slate-800">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <LuChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 mb-2">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((day, i) => {
                            const isSelected = selectedDateObj ? isSameDay(day, selectedDateObj) : false;
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isToday = isSameDay(day, new Date());
                            const isDisabled = minDateObj ? isBefore(startOfDay(day), minDateObj) : false;

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => handleDateSelect(day)}
                                    className={`
                                        h-7 w-full rounded-md flex items-center justify-center text-xs font-medium transition-colors
                                        ${isDisabled ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer'}
                                        ${!isDisabled && !isSelected && isCurrentMonth ? 'text-slate-700 hover:bg-slate-100' : ''}
                                        ${!isDisabled && !isSelected && !isCurrentMonth ? 'text-slate-400 hover:bg-slate-100' : ''}
                                        ${isSelected ? 'bg-primary-600 text-white shadow-xs font-bold' : ''}
                                        ${isToday && !isSelected ? 'border border-primary-200 text-primary-700 bg-primary-50' : ''}
                                    `}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
