import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Elevate | Career Guidance for SEND Education',
  description: 'AI-powered career guidance platform for special education. Gatsby Benchmarks, ASDAN qualifications, and student progress tracking. Built by OpStack.',
  keywords: ['special education', 'career guidance', 'SEND', 'Gatsby Benchmarks', 'ASDAN', 'student progress', 'EdTech'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
