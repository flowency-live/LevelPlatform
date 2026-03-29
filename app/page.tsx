'use client';

import Link from 'next/link';

const portals = [
  {
    title: 'Student Portal',
    description: 'Track your progress across all 8 Gatsby Benchmarks and build your career plan',
    href: '/student',
    linkText: 'Enter as Student',
    icon: (
      <svg className="w-10 h-10 text-gatsby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    title: 'Teacher Dashboard',
    description: 'View student progress heatmaps, review evidence, and support individual careers journeys',
    href: '/teacher',
    linkText: 'Enter as Teacher',
    icon: (
      <svg className="w-10 h-10 text-gatsby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'School Management',
    description: 'School-wide analytics, Ofsted reporting, and ASDAN credit tracking',
    href: '/admin',
    linkText: 'Enter Management',
    icon: (
      <svg className="w-10 h-10 text-gatsby" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-gatsby rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-text-primary">Elevate</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-2">
        Careers Guidance Platform
      </h1>
      <p className="text-text-secondary text-center mb-12 max-w-xl">
        Track student progress across the 8 Gatsby Benchmarks with evidence-based careers education
      </p>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
        {portals.map((portal) => (
          <div
            key={portal.href}
            className="bg-white rounded-xl border border-border-default p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              {portal.icon}
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              {portal.title}
            </h2>
            <p className="text-sm text-text-secondary mb-6 flex-1">
              {portal.description}
            </p>
            <Link
              href={portal.href}
              className="w-full py-3 px-6 bg-gatsby text-white rounded-lg font-medium hover:bg-gatsby-dark transition-colors text-center"
            >
              {portal.linkText}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary text-center">
        Supporting all 8 benchmarks with UK careers guidance standards and ASDAN integration
      </p>
    </div>
  );
}
