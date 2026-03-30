'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/shared/BottomNav';

const navItems = [
  { icon: 'home', label: 'Home', href: '/student' },
  { icon: 'plan', label: 'My Plan', href: '/student/plan' },
  { icon: 'target', label: 'Targets', href: '/student/targets' },
  { icon: 'employer', label: 'Employers', href: '/student/employers' },
  { icon: 'user', label: 'Profile', href: '/student/profile' },
];

const sidebarIcons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  plan: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  employer: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-surface-page">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 bg-tenant-primary">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-white leading-none">Arnfield Care</span>
            <span className="text-[11px] text-white/60 font-normal mt-0.5">Level Career Plan</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-individual flex items-center justify-center text-white font-semibold text-sm">
            EW
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-white leading-none">Emma Wilson</span>
            <span className="text-[12px] text-white/60 font-normal mt-0.5">Year 10</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === pathname || (item.href !== '/student' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all
                  ${isActive
                    ? 'bg-white text-tenant-primary'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {sidebarIcons[item.icon]}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Switch Role */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Switch Role
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-56">
        {/* Mobile Header */}
        <header role="banner" className="lg:hidden sticky top-0 z-40 bg-tenant-primary text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight leading-none">Elevate</span>
              <span className="text-[11px] text-white/70 font-normal">Arnfield Care</span>
            </div>
          </div>

          {/* User avatar */}
          <button className="w-9 h-9 rounded-full bg-individual flex items-center justify-center text-[13px] font-semibold text-white">
            EW
          </button>
        </header>

        {/* Page Content */}
        <main role="main" className="pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav
          items={navItems.map(item => ({
            icon: item.icon === 'plan' ? 'chart' : item.icon === 'employer' ? 'home' : item.icon,
            label: item.label,
            href: item.href,
          }))}
          activeHref={pathname}
          persona="student"
        />
      </div>
    </div>
  );
}
