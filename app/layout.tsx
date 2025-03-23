import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // choose what you need
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Your Finance Brand - Social Links",
  description: "Connect with Your Finance Brand on all social media platforms",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}

