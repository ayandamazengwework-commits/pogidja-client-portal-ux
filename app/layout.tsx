import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata = {
  title: {
    default: 'POG Advisory Portal',
    template: '%s | POG Advisory',
  },

  description:
    'Secure client portal for POG Advisory. Manage services, documents, invoices and communication.',

  openGraph: {
    title: 'POG Advisory Portal',
    description:
      'Secure client portal for POG Advisory clients.',
    url: 'https://www.pogadvisoryportal.co.za',
    siteName: 'POG Advisory',
    images: [
      {
        url: 'https://www.pogadvisoryportal.co.za/og-image.png',
        width: 1200,
        height: 630,
        alt: 'POG Advisory Portal',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'POG Advisory Portal',
    description:
      'Secure client portal for POG Advisory clients.',
    images: [
      'https://www.pogadvisoryportal.co.za/og-image.png',
    ],
  },

  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1c2b4a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster position="top-center" />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
