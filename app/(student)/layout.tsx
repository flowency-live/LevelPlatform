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
      <header role="banner" className="bg-tenant-arnfield text-white px-4 py-3">
        <h1 className="text-lg font-semibold">Elevate</h1>
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
