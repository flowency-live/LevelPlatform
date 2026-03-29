'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/shared/BottomNav';

const navItems = [
  { icon: 'home', label: 'Home', href: '/student' },
  { icon: 'chart', label: 'Plan', href: '/student/plan' },
  { icon: 'target', label: 'Targets', href: '/student/targets' },
  { icon: 'user', label: 'Profile', href: '/student/profile' },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tenant header */}
      <header role="banner" className="bg-tenant-primary text-white px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-lg font-semibold">Elevate</span>
      </header>

      {/* Main content */}
      <main role="main" className="flex-1 bg-surface-page pb-16">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav
        items={navItems}
        activeHref={pathname}
        persona="student"
      />
    </div>
  );
}
