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
  ArrowLeft,
  CheckCircle2,
  Camera,
  Mic,
  BarChart3,
  FileText
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`p-3 rounded-xl ${
          isIndividual ? 'bg-orange-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-5 h-5 ${
            isIndividual ? 'text-orange-600' : 'text-blue-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
              isIndividual
                ? 'bg-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {benchmark.id}
            </span>
            <h3 className="text-base font-semibold text-gray-900">
              {benchmark.title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {benchmark.description}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Student Activities</h4>
            <div className="space-y-2">
              {benchmark.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{activity.task}</p>
                    <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-medium">
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
  const [expandedBenchmarks, setExpandedBenchmarks] = useState<Set<string>>(new Set(['GB1']))

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
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Level</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-teal-700">Level</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">My Career Plan</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-4 md:mb-6">
            <span className="text-xs md:text-sm text-gray-600">Digital Career Guidance</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">UK</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            My Career Plan
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Gatsby Benchmarks &bull; ASDAN &bull; Ofsted-Ready
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="px-4 md:px-6 pb-6 md:pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 p-3 md:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-blue-100 border border-blue-200" />
              <span className="text-xs md:text-sm text-gray-600">Gatsby</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-orange-100 border border-orange-200" />
              <span className="text-xs md:text-sm text-gray-600">Individual</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-emerald-100 border border-emerald-200" />
              <span className="text-xs md:text-sm text-gray-600">ASDAN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Digital Section */}
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 md:mb-6">Why Go Digital?</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Photo Evidence</h3>
                <p className="text-xs md:text-sm text-gray-500">Capture activities with mobile camera</p>
              </div>

              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Mic className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Voice Reflections</h3>
                <p className="text-xs md:text-sm text-gray-500">Speak instead of write</p>
              </div>

              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Real-Time Tracking</h3>
                <p className="text-xs md:text-sm text-gray-500">See progress instantly</p>
              </div>

              <div className="text-center p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Ofsted Reports</h3>
                <p className="text-xs md:text-sm text-gray-500">One-click export</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Portals */}
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 md:mb-6 text-center">Three Portals, One Platform</h2>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Portal</h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete activities, upload evidence, track progress across all 8 benchmarks
              </p>
              <div className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
                Enter as Student
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Dashboard</h3>
              <p className="text-sm text-gray-500 mb-4">
                Review students, validate completions, add notes, run termly reviews
              </p>
              <div className="inline-block px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium">
                Enter as Teacher
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">School Management</h3>
              <p className="text-sm text-gray-500 mb-4">
                School-wide analytics, Ofsted reports, cohort tracking, compliance dashboard
              </p>
              <div className="inline-block px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium">
                Enter School Management
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gatsby Benchmarks */}
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">The 8 Gatsby Benchmarks</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
            The UK&apos;s statutory framework for careers guidance, with ASDAN mapping built in.
          </p>

          <div className="space-y-3">
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
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-8">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-2.5 rounded-xl bg-emerald-100">
                <FileCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">ASDAN Mapping</h2>
            </div>

            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Every activity maps to ASDAN units. Students build qualifications while completing their career plan.
            </p>

            <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">Career Activity</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">ASDAN Qualification</th>
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
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{activity}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
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
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 md:mb-6">Security & Compliance</h2>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {/* Data Protection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Data Protection</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  GDPR (UK) compliant with documented DPIA
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  All data stored in AWS UK regions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  AES-256 encryption at rest, TLS 1.3 in transit
                </li>
              </ul>
            </div>

            {/* Safeguarding */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Safeguarding</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Role-based access control throughout
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Full audit trail of all data access
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Staff approval for external sharing
                </li>
              </ul>
            </div>

            {/* Cyber Security */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Cyber Security</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  AWS Well-Architected Framework
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Multi-factor authentication for staff
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Cyber Essentials Plus certification
                </li>
              </ul>
            </div>

            {/* Anonymisation */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Anonymisation</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Analytics use cohort-level data only
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  Minimum cohort size for statistics
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  No third-party data sharing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-4 md:px-6 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 md:p-8 text-center text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Go Digital?</h2>
            <p className="text-teal-100 mb-5 md:mb-6 max-w-xl mx-auto text-sm md:text-base">
              Transform paper-based career plans into a powerful digital platform with real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href="/Student Plan.pdf"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Booklet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-teal-700">Level</span>
            <span className="text-gray-400">by OpStack</span>
          </div>
          <div className="text-xs md:text-sm text-gray-500 order-last md:order-none">
            UK Curriculum &bull; ASDAN &bull; AI-powered
          </div>
          <a href="mailto:hello@opstack.uk" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
            hello@opstack.uk
          </a>
        </div>
      </footer>
    </div>
  )
}
