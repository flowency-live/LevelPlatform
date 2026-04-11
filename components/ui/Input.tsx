'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, disabled, required, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${inputId}-error` : undefined;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={errorId}
            className={cn(
              'w-full h-12 px-4 text-base rounded-md border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
              error
                ? 'border-status-error focus-visible:ring-status-error'
                : 'border-border focus-visible:border-tenant-primary focus-visible:ring-tenant-primary/20',
              disabled && 'bg-muted cursor-not-allowed text-muted-foreground',
              isPassword && 'pr-12',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-status-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
