import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'mobx-react';
import { UserProvider } from '../store/userData';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rare Media',
  description: 'Rare Things Only',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </UserProvider>
  )
}
