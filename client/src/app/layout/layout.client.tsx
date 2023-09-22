'use client'
import { Navbar } from '@/app/layout/Header/Navbar'
import { RecoilProvider } from '@/components/RecoilProvider'
import { getInitialTokens, poolState } from '@/features/pool/pool.state'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { resetRecoil } from 'recoil-nexus'
import { Footer } from './Footer'
import { GlowWrapper } from './GlowWrapper'
import { Drawer } from './Header/Drawer'
import { NetworkNotice } from './Header/NetworkNotice'

interface Props {
  readonly children: ReactNode
}

export const LayoutClient = ({ children }: Props) => {
  const pathname = usePathname()

  useEffect(() => {
    resetRecoil(poolState)
    getInitialTokens()
  }, [pathname])

  return (
    <main className="h-screen">
      <RecoilProvider>
        <div className="h-full overflow-y-auto overflow-x-hidden bg-[var(--bg-black)]">
          <NetworkNotice />
          <Drawer />
          <div className="flex flex-col h-full">
            <Navbar />

            <GlowWrapper>{children}</GlowWrapper>

            <Footer />
          </div>
        </div>
      </RecoilProvider>
    </main>
  )
}
