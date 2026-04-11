import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Level | Career Guidance for Alternative Provision',
  description: 'Career guidance platform for alternative provision and specialist settings. Gatsby Benchmarks, ASDAN qualifications, and student progress tracking.',
  keywords: ['alternative provision', 'career guidance', 'vulnerable children', 'Gatsby Benchmarks', 'ASDAN', 'student progress', 'EdTech'],
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
