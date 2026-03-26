'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  Target,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  MapPin,
  MessageSquare,
  Compass,
  Shield,
  Lock,
  FileCheck,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react'

// Gatsby Benchmark data
const gatsbyBenchmarks = [
  {
    id: 'GB1',
    title: 'A Stable Careers Programme',
    color: 'gatsby',
    icon: Target,
    description: 'Every school should have an embedded programme of careers education and guidance that is known and understood by students, parents, teachers, and employers.',
    activities: [
      { task: 'Attend careers week activities', asdan: 'CoPE: Planning for the Future' },
      { task: 'Have termly check-ins with form tutor', asdan: 'Personal Development Short Course' },
      { task: 'Know their Careers Leader/Adviser', asdan: 'CoPE: Planning for the Future' },
      { task: 'Complete their career plan', asdan: 'CoPE: Planning for the Future' },
    ]
  },
  {
    id: 'GB2',
    title: 'Learning About the Job Market',
    color: 'gatsby',
    icon: MapPin,
    description: 'Every student should understand the full range of opportunities available to them, including academic and vocational routes and labour market information.',
    activities: [
      { task: 'Research 3+ careers of interest', asdan: 'Research Skills / Using the Internet' },
      { task: 'Explore local job market growth areas', asdan: 'Research Skills / Using the Internet' },
      { task: 'Attend sector spotlight assemblies', asdan: 'CoPE: Planning for the Future' },
      { task: 'Set up National Careers Service account (Y10+)', asdan: 'Research Skills Unit' },
    ]
  },
  {
    id: 'GB3',
    title: 'Support for Individual Needs',
    color: 'individual',
    icon: Users,
    description: 'Students have different career guidance needs at different stages. Advice should be tailored to individual circumstances and backgrounds.',
    activities: [
      { task: 'Discuss goals with tutor/careers adviser', asdan: 'Managing Emotions / Self-Review' },
      { task: 'Complete personal profile', asdan: 'CoPE: Planning for the Future' },
      { task: 'Attend 1:1 careers guidance interview', asdan: 'Action Planning Unit' },
      { task: 'Share additional needs with adviser', asdan: 'Working with Others Unit' },
    ]
  },
  {
    id: 'GB4',
    title: 'Careers in the Curriculum',
    color: 'gatsby',
    icon: GraduationCap,
    description: 'All teachers should link curriculum learning to careers, helping students understand the relevance of their subjects to future pathways.',
    activities: [
      { task: 'Find career links for each subject', asdan: 'Vocational Tasters Unit' },
      { task: 'Complete subject-career activities in lessons', asdan: 'Vocational Tasters Unit' },
      { task: 'Use careers skills passport', asdan: 'ASDAN Personal Development' },
      { task: 'Ask teachers how subjects link to jobs', asdan: 'Vocational Tasters Unit' },
    ]
  },
  {
    id: 'GB5',
    title: 'Employer Encounters',
    color: 'gatsby',
    icon: Building2,
    description: 'Every student should have multiple opportunities to learn from employers about work and the skills that are valued in the workplace.',
    activities: [
      { task: 'Attend careers fairs/employer assemblies', asdan: 'Enterprise / Young Enterprise' },
      { task: 'Participate in virtual employer Q&As', asdan: 'Enterprise Unit' },
      { task: 'Complete mock interviews with employers (Y11+)', asdan: 'Enterprise / Teamwork Unit' },
      { task: 'Reflect on each employer encounter', asdan: 'CoPE: Planning for the Future' },
    ]
  },
  {
    id: 'GB6',
    title: 'Workplace Experience',
    color: 'individual',
    icon: Briefcase,
    description: 'Every student should have first-hand experience of the workplace through work visits, work shadowing, or work experience.',
    activities: [
      { task: 'Complete work experience placement (Y10)', asdan: 'Work Experience Prep & Review' },
      { task: 'Write reflection journal during placement', asdan: 'Work Experience Prep & Review' },
      { task: 'Complete volunteering/community project', asdan: 'Community Volunteering Unit' },
      { task: 'Attend curriculum-linked workplace visits', asdan: 'Vocational Tasters Unit' },
    ]
  },
  {
    id: 'GB7',
    title: 'Further Education Awareness',
    color: 'gatsby',
    icon: Compass,
    description: 'All students should understand the full range of academic and vocational qualifications and pathways available post-16 and post-18.',
    activities: [
      { task: 'Attend post-16/18 options events', asdan: 'Preparing for College Unit' },
      { task: 'Visit colleges, sixth forms, or universities', asdan: 'Higher Education Awareness Unit' },
      { task: 'Research 2+ different pathways', asdan: 'Research Skills Unit' },
      { task: 'Complete Pathways Planner', asdan: 'CoPE: Planning for the Future' },
    ]
  },
  {
    id: 'GB8',
    title: 'Personal Guidance',
    color: 'gatsby',
    icon: MessageSquare,
    description: 'Every student should have at least one personal careers guidance interview with a qualified adviser.',
    activities: [
      { task: 'Attend 1:1 careers guidance interview', asdan: 'Action Planning / Self-Review' },
      { task: 'Set 3 SMART targets', asdan: 'Action Planning Unit' },
      { task: 'Review targets termly with tutor', asdan: 'Managing My Learning Unit' },
      { task: 'Update career plan after every activity', asdan: 'CoPE: Planning for the Future' },
    ]
  },
]

function BenchmarkCard({ benchmark, isExpanded, onToggle }: {
  benchmark: typeof gatsbyBenchmarks[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  const Icon = benchmark.icon
  const isIndividual = benchmark.color === 'individual'

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
      isIndividual
        ? 'border-orange-500/30 bg-orange-950/20'
        : 'border-blue-500/30 bg-blue-950/20'
    }`}>
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className={`p-3 rounded-lg ${
          isIndividual ? 'bg-orange-500/20' : 'bg-blue-500/20'
        }`}>
          <Icon className={`w-6 h-6 ${
            isIndividual ? 'text-orange-400' : 'text-blue-400'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${
              isIndividual
                ? 'bg-orange-500/30 text-orange-300'
                : 'bg-blue-500/30 text-blue-300'
            }`}>
              {benchmark.id}
            </span>
            <h3 className="text-lg font-semibold text-white">
              {benchmark.title}
            </h3>
          </div>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {benchmark.description}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Student Activities</h4>
            <div className="space-y-2">
              {benchmark.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
                  <div className="w-5 h-5 rounded border-2 border-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.task}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activity.asdan}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PlanPage() {
  const [expandedBenchmarks, setExpandedBenchmarks] = useState<Set<string>>(new Set())

  const toggleBenchmark = (id: string) => {
    setExpandedBenchmarks(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedBenchmarks(new Set(gatsbyBenchmarks.map(b => b.id)))
  }

  const collapseAll = () => {
    setExpandedBenchmarks(new Set())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Level</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold level-gradient-text">Level</span>
            <span className="text-gray-500">|</span>
            <span className="text-sm text-gray-400">My Career Plan</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-sm text-gray-300">Product Requirements Document</span>
            <span className="text-xs px-2 py-0.5 rounded bg-level-primary/20 text-level-accent">v2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Career Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Digital Career Guidance Platform for UK Schools
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500/50" />
              <span className="text-sm text-gray-300">Gatsby Benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/50" />
              <span className="text-sm text-gray-300">Individual Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500/50" />
              <span className="text-sm text-gray-300">ASDAN Qualification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="level-card p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                Level is a digital career guidance platform that transforms the statutory Gatsby Benchmark
                framework into an accessible, evidence-based student journey. Designed specifically for UK
                schools supporting students with additional needs, Level digitises the &ldquo;My Career Plan&rdquo;
                booklet while adding real-time progress tracking, evidence capture, and Ofsted-ready reporting.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-2">For Students</h3>
                  <p className="text-sm text-gray-400">
                    Simple, accessible interface to track career activities with photo and voice evidence
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-2">For Staff</h3>
                  <p className="text-sm text-gray-400">
                    Real-time dashboards showing student progress without additional admin burden
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-2">For Leadership</h3>
                  <p className="text-sm text-gray-400">
                    Instant Ofsted-ready reports demonstrating benchmark compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gatsby Benchmarks */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">The 8 Gatsby Benchmarks</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          <p className="text-gray-400 mb-8">
            The Gatsby Benchmarks are the UK&apos;s statutory framework for careers guidance in schools,
            established by the Gatsby Foundation and adopted by the Department for Education.
          </p>

          <div className="space-y-4">
            {gatsbyBenchmarks.map(benchmark => (
              <BenchmarkCard
                key={benchmark.id}
                benchmark={benchmark}
                isExpanded={expandedBenchmarks.has(benchmark.id)}
                onToggle={() => toggleBenchmark(benchmark.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ASDAN Integration */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="level-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <FileCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">ASDAN Qualification Integration</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Level natively integrates with ASDAN (Award Scheme Development and Accreditation Network)
              qualifications, allowing career activities to contribute directly toward recognised awards.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Career Activity</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">ASDAN Qualification</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Career planning activities', 'CoPE: Planning for the Future'],
                    ['Self-reflection exercises', 'Personal Development Short Course'],
                    ['Career research', 'Research Skills / Using the Internet'],
                    ['Goal setting', 'Managing Emotions / Self-Review'],
                    ['Interview preparation', 'Action Planning Unit'],
                    ['Employer interactions', 'Enterprise / Young Enterprise'],
                    ['Work experience', 'Work Experience Prep & Review'],
                    ['Volunteering', 'Community Volunteering Unit'],
                    ['Post-16 exploration', 'Preparing for College / Higher Education Awareness'],
                    ['Target tracking', 'Managing My Learning'],
                  ].map(([activity, asdan], idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-300">{activity}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                          {asdan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Security, Safeguarding & Compliance</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Data Protection */}
            <div className="level-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Data Protection</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  GDPR (UK) compliant with documented DPIA
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  All data stored in AWS UK regions (eu-west-2)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  AES-256 encryption at rest, TLS 1.3 in transit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Data portability and right to erasure workflows
                </li>
              </ul>
            </div>

            {/* Safeguarding */}
            <div className="level-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Eye className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Safeguarding</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Role-based access control (student sees own data only)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Full audit trail of all data access
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Content moderation for uploads
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Staff approval required for external sharing
                </li>
              </ul>
            </div>

            {/* Cyber Security */}
            <div className="level-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Cyber Security</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  AWS Well-Architected Framework compliance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Multi-factor authentication for staff
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Annual penetration testing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Cyber Essentials Plus certification (target)
                </li>
              </ul>
            </div>

            {/* Anonymisation */}
            <div className="level-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Anonymisation</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Analytics use cohort-level data only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Minimum cohort size of 10 for statistics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  Small number suppression to prevent identification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-level-accent">•</span>
                  No third-party data sharing without consent
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Table */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="level-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Compliance Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Requirement</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GDPR (UK)', 'Compliant', 'DPA, DPIA on file'],
                    ['Gatsby Benchmarks', 'Native support', '1:1 benchmark mapping'],
                    ['ASDAN', 'Integrated', 'Unit mapping table'],
                    ['Ofsted requirements', 'Export ready', 'One-click reports'],
                    ['Keeping Children Safe in Education', 'Aligned', 'Safeguarding controls'],
                    ['Accessibility (WCAG 2.1 AA)', 'Target', 'Accessibility statement'],
                    ['Cyber Essentials Plus', 'Target', 'Certification in progress'],
                  ].map(([requirement, status, evidence], idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-300">{requirement}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                          status === 'Compliant' || status === 'Native support' || status === 'Integrated' || status === 'Export ready' || status === 'Aligned'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="level-card p-8 text-center bg-gradient-to-br from-level-primary/20 to-level-accent/10">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Learn More?</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Get in touch to discuss how Level can support your school&apos;s careers guidance programme.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                Contact Us
              </Link>
              <a
                href="/Student Plan.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Sample Booklet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold level-gradient-text">Level</span>
            <span className="text-gray-500">by OpStack</span>
          </div>
          <div className="text-sm text-gray-500">
            Document version 2.0 | March 2026
          </div>
          <a href="mailto:hello@opstack.uk" className="text-sm text-gray-400 hover:text-white transition-colors">
            hello@opstack.uk
          </a>
        </div>
      </footer>
    </div>
  )
}
