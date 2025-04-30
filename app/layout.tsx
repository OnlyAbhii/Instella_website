import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Instella',
  description: 'Created By Abii with ❤️',
  generator: 'Abhii',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
