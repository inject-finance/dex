'use client'
import { Navbar } from '@/app/layout/Header/Navbar'
import { RecoilProvider } from '@/components/RecoilProvider'
import { poolState } from '@/features/pool/pool.state'
import { useEffect, type ReactNode } from 'react'
import { resetRecoil } from 'recoil-nexus'
import { Footer } from './Footer'
import { GlowWrapper } from './GlowWrapper'
import { Drawer } from './Header/Drawer'
import { NetworkNotice } from './Header/NetworkNotice'

type Props = {
  children: ReactNode
}

export const LayoutClient: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    resetRecoil(poolState)
  }, [])

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
