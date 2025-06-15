import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { ThirdwebProvider } from '@thirdweb-dev/react'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Frida2',
  description: 'Event booking with Web3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThirdwebProvider activeChain="polygon">
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  )
}
