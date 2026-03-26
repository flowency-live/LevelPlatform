import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Career Plan | Level PRD',
  description: 'Product Requirements Document for Level\'s digital career guidance platform. Gatsby Benchmarks, ASDAN integration, and Ofsted-ready reporting for UK schools.',
  keywords: ['Gatsby Benchmarks', 'careers guidance', 'ASDAN', 'Ofsted', 'special education', 'SEN', 'UK schools', 'career plan'],
  openGraph: {
    title: 'My Career Plan | Level',
    description: 'Digital Career Guidance Platform for UK Schools',
    type: 'article',
  },
}

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
