import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Level | Special Education School Management',
  description: 'AI-powered school management for special education. UK National Curriculum integration, intelligent assessments, and student progress tracking. Built by OpStack.',
  keywords: ['special education', 'school management', 'SEND', 'UK curriculum', 'AI assessments', 'student progress', 'EdTech'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
