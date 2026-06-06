import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ผู้ช่วยลดน้ำหนัก | Weight Loss Assistant',
  description: 'ผู้ช่วยลดน้ำหนักอัจฉริยะ ติดตามแคลอรี่ ออกกำลังกาย และรับคำแนะนำจาก AI',
  keywords: ['ลดน้ำหนัก', 'แคลอรี่', 'สุขภาพ', 'ออกกำลังกาย', 'ไดเอท'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
