'use client';

import Link from 'next/link';
import { useState } from 'react';

type Persona = 'student' | 'teacher' | 'management';

const portals = [
  {
    id: 'student' as Persona,
    title: 'Student Portal',
    role: 'Student',
    name: 'Emma Wilson',
    subtitle: 'Year 10 · Arnfield Care',
    description: 'View your My Career Plan, complete Gatsby Benchmark activities, log employer encounters and set SMART targets.',
    features: ['GB1–GB8 checklist', 'Evidence capture', 'SMART targets', 'Employer log'],
    href: '/student',
    linkText: 'Enter as Student',
    color: 'blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: 'teacher' as Persona,
    title: 'Teacher Dashboard',
    role: 'Teacher / Staff',
    name: 'Mr Johnson',
    subtitle: 'Form Tutor · 10B',
    description: 'Monitor your students\' Gatsby Benchmark progress, validate activity completions, add notes and run term reviews.',
    features: ['Student heatmap', 'Activity validation', 'Term reviews', 'Notes & flags'],
    href: '/teacher',
    linkText: 'Enter as Teacher',
    color: 'teal',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'management' as Persona,
    title: 'School Management',
    role: 'School Leadership',
    name: 'Ms Harrison',
    subtitle: 'Deputy Head · Arnfield Care',
    description: 'School-wide benchmark compliance overview, Ofsted-ready reporting, employer encounter tracking and trend analysis.',
    features: ['Compliance overview', 'Ofsted reports', 'Employer tracking', 'Trend analysis'],
    href: '/admin',
    linkText: 'Enter Management',
    color: 'slate',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const colorClasses = {
  blue: {
    iconBg: 'bg-persona-student-bg',
    iconText: 'text-persona-student',
    badge: 'bg-persona-student-bg text-persona-student',
    button: 'bg-persona-student hover:bg-blue-600',
    bullet: 'bg-persona-student',
    border: 'border-persona-student',
    ring: 'ring-persona-student/20',
  },
  teal: {
    iconBg: 'bg-persona-teacher-bg',
    iconText: 'text-persona-teacher',
    badge: 'bg-persona-teacher-bg text-persona-teacher',
    button: 'bg-persona-teacher hover:bg-teal-600',
    bullet: 'bg-persona-teacher',
    border: 'border-persona-teacher',
    ring: 'ring-persona-teacher/20',
  },
  slate: {
    iconBg: 'bg-persona-management-bg',
    iconText: 'text-persona-management',
    badge: 'bg-persona-management-bg text-persona-management',
    button: 'bg-persona-management hover:bg-slate-600',
    bullet: 'bg-persona-management',
    border: 'border-persona-management',
    ring: 'ring-persona-management/20',
  },
};

export default function Home() {
  const [selectedPortal, setSelectedPortal] = useState<Persona>('student');

  return (
    <div data-testid="portal-page" className="min-h-screen bg-background animate-in fade-in duration-500">
      {/* Tenant Header Bar */}
      <header className="bg-tenant-primary h-2" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] md:text-[40px] font-bold text-text-primary tracking-tight mb-3">
            Who are you today?
          </h1>
          <p className="text-[16px] text-text-secondary">
            Select your role to see the view that&apos;s right for you.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {portals.map((portal) => {
            const colors = colorClasses[portal.color as keyof typeof colorClasses];
            const isSelected = selectedPortal === portal.id;

            return (
              <article
                key={portal.id}
                onClick={() => setSelectedPortal(portal.id)}
                className={`
                  relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 shadow-sm
                  ${isSelected
                    ? `${colors.border} ${colors.ring} ring-4 shadow-lg`
                    : 'border-border-default hover:border-border-strong hover:shadow-md'
                  }
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <svg className={`w-4 h-4 ${colors.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Icon and Role Badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconText}`}>
                    {portal.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${colors.badge}`}>
                    {portal.role}
                  </span>
                </div>

                {/* User Info */}
                <h2 className="text-[20px] font-bold text-text-primary mb-1">
                  {portal.name}
                </h2>
                <p className="text-[13px] text-text-secondary mb-4">
                  {portal.subtitle}
                </p>

                {/* Description */}
                <p className="text-[14px] text-text-secondary leading-relaxed mb-5">
                  {portal.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {portal.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[13px] text-text-primary">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.bullet}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Enter Button */}
                <Link
                  href={portal.href}
                  className={`
                    flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
                    text-[14px] font-semibold text-white transition-colors
                    ${colors.button}
                  `}
                >
                  {portal.linkText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-text-muted mt-12">
          Supporting all 8 benchmarks with UK careers guidance standards and ASDAN integration
        </p>
      </main>
    </div>
  );
}
