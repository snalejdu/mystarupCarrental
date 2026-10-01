import React, { forwardRef } from 'react';
import * as Select from '@radix-ui/react-select';
import { LuCheck, LuChevronDown } from 'react-icons/lu';

export interface CustomSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
    ({ value, onChange, options, placeholder = 'Select...', icon, className = '' }, ref) => {
        return (
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger
                    ref={ref}
                    className={`w-full flex items-center justify-between pl-8 pr-3 py-2.5 sm:py-2.5 rounded-xl sm:rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors shadow-xs ${className}`}
                    style={{ colorScheme: 'light' }}
                >
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                    <Select.Value placeholder={placeholder} />
                    <Select.Icon>
                        <LuChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={6}
                        className="overflow-hidden bg-white rounded-xl shadow-lg border border-slate-200 z-50 animate-in fade-in-80 slide-in-from-top-2 w-[var(--radix-select-trigger-width)] max-h-[40vh]"
                        style={{ colorScheme: 'light' }}
                    >
                        <Select.Viewport className="p-1.5">
                            {options.map((option) => (
                                <Select.Item
                                    key={option.value}
                                    value={option.value}
                                    className="relative flex items-center px-6 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm text-slate-700 font-medium select-none cursor-pointer outline-none hover:bg-slate-50 focus:bg-slate-100 data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700 transition-colors"
                                >
                                    <Select.ItemText>{option.label}</Select.ItemText>
                                    <Select.ItemIndicator className="absolute left-1.5 flex items-center justify-center">
                                        <LuCheck className="w-3.5 h-3.5 text-primary-600" />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        );
    }
);

CustomSelect.displayName = 'CustomSelect';
