import { Figtree, Syne } from 'next/font/google'
import './globals.css'

const brand = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-brand',
})

const body = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata = {
  title: 'PickMyWinner',
  description: 'Independent live draw tools for brands running public giveaways.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${brand.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
