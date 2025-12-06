import type { Metadata } from 'next'
import './globals.css'
import './responsive-headers.css'
import { SidebarProvider } from '../components/layout/SidebarContext'

export const metadata: Metadata = {
  title: 'Hearth Management Platform',
  description: 'Digital Asset Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  )
}



