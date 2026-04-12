// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import I18nProvider from '@/providers/I18n-provider'
import './globals.css'
import RootLayouter from '@/components/layout/RootLayout';
import BackToTop from '@/components/common/_others/BackToTop'
import AuthProvider from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HousePlateforme - Trouvez votre logement idéal',
  description: 'Plateforme de location de chambres, appartements, studios et maisons',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>
            <RootLayouter>{children}</RootLayouter>
          </AuthProvider>
        </I18nProvider>

        <BackToTop />
      </body>
    </html>
  )
}