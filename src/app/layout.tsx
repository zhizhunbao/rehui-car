import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReHui Car - AI-Powered Car Buying Advisor',
  description: 'AI-driven car buying advisor system for Canada with bilingual support',
  keywords: ['car advisor', 'AI', 'Canada', 'bilingual', 'car buying'],
  authors: [{ name: 'ReHui Car Team' }],
  openGraph: {
    title: 'ReHui Car - AI-Powered Car Buying Advisor',
    description: 'AI-driven car buying advisor system for Canada with bilingual support',
    type: 'website',
    locale: 'en_CA',
    siteName: 'ReHui Car',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReHui Car - AI-Powered Car Buying Advisor',
    description: 'AI-driven car buying advisor system for Canada with bilingual support',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 