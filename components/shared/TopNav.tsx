'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TopNavItem {
  label: string;
  href: string;
}

export interface TopNavProps {
  items: TopNavItem[];
  activeHref: string;
  persona: 'teacher' | 'management';
  userName: string;
}

const personaBorderColors = {
  teacher: 'border-persona-teacher',
  management: 'border-persona-management',
};

export function TopNav({ items, activeHref, persona, userName }: TopNavProps) {
  return (
    <nav
      aria-label="Staff navigation"
      className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-border-default"
    >
      {/* Navigation links */}
      <ul className="flex items-center h-full gap-1">
        {items.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center h-14 px-4 text-sm font-medium',
                  'transition-colors duration-150',
                  isActive
                    ? cn('text-text-primary border-b-2', personaBorderColors[persona])
                    : 'text-text-secondary hover:text-text-primary border-b-2 border-transparent'
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-primary">{userName}</span>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}
