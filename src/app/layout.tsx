import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Social Media Content Manager',
  description: 'AI-powered social media content management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-charcoal">{children}</body>
    </html>
  )
}
