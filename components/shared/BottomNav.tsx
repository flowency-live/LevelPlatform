'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export interface BottomNavProps {
  items: NavItem[];
  activeHref: string;
  persona: 'student' | 'teacher' | 'management';
}

const personaColors = {
  student: 'text-persona-student',
  teacher: 'text-persona-teacher',
  management: 'text-persona-management',
};

const personaBgColors = {
  student: 'bg-persona-student-bg',
  teacher: 'bg-persona-teacher-bg',
  management: 'bg-persona-management-bg',
};

const icons: Record<string, (active: boolean) => React.ReactNode> = {
  home: (active) => (
    <svg className="w-[22px] h-[22px]" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  chart: (active) => (
    <svg className="w-[22px] h-[22px]" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  target: (active) => (
    <svg className="w-[22px] h-[22px]" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  user: (active) => (
    <svg className="w-[22px] h-[22px]" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export function BottomNav({ items, activeHref, persona }: BottomNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-lg border-t border-border-default z-50 safe-area-inset-bottom"
    >
      <ul className="flex items-center justify-around h-[68px] max-w-md mx-auto px-2">
        {items.map((item) => {
          const isActive = item.href === activeHref;
          const IconComponent = icons[item.icon] || icons.home;
          return (
            <li key={item.href} className="flex-1 flex justify-center">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl min-w-[56px]',
                  'transition-all duration-200',
                  isActive
                    ? cn(personaColors[persona], personaBgColors[persona])
                    : 'text-text-muted hover:text-text-secondary hover:bg-muted'
                )}
              >
                <span className="relative">
                  {IconComponent(isActive)}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      data-testid="nav-badge"
                      className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-status-error rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className={cn(
                  "text-[11px] font-medium",
                  isActive ? "font-semibold" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
