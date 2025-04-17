import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ 
  checked, 
  onChange, 
  label,
  size = 'md',
  disabled = false,
  className
}: ToggleSwitchProps) {
  const handleOnChange = (value: boolean) => {
    onChange(value);
  };

  return (
    <div className={cn("inline-flex items-center", className)}>
      <Switch
        checked={checked}
        onCheckedChange={handleOnChange}
        disabled={disabled}
        className={cn(
          size === 'sm' && "h-5 w-9",
          size === 'lg' && "h-7 w-12"
        )}
      />
      {label && (
        <span className="ml-3 text-sm font-medium text-neutral-900">{label}</span>
      )}
    </div>
  );
}
