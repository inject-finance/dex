import '@/assets/css/globals.css'
import '@/assets/css/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-modern-drawer/dist/index.css'
import 'sweetalert2/src/sweetalert2.scss'
import { LayoutClient } from '@/app/layout/layout.client'
import { type Metadata } from 'next'
import { type ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Inject Finance',
  icons: {
    icon: '/favicon.ico'
  },
  themeColor: {
    color: 'dark',
    media: '(prefers-color-scheme: dark)'
  }
}

export default function RootLayout({
  children
}: {
  readonly children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
