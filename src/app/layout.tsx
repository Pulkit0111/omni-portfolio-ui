import Providers from './providers'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Omnichain Portfolio",
  description: "Omnichain Portfolio to track your presence across all chains",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
