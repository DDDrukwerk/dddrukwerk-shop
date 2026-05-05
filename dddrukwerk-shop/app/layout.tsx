import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DDDrukwerk | Premium Custom Merchandise',
  description: 'Handgemaakte keychains en UV prints in Nederland & België',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
