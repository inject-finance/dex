'use client'
import { Navbar } from '@/app/layout/Header/Navbar'
import constants from '@/common/configuration/constants'
import { RecoilProvider } from '@/components/RecoilProvider'
import { poolState, setPoolState } from '@/features/pool/pool.state'
import { getTokenBySymbol } from '@/features/tokens/selectors/getTokenBySymbol.selector'
import { useEffect, type ReactNode } from 'react'
import { getRecoilPromise, resetRecoil } from 'recoil-nexus'
import { Footer } from './Footer'
import { GlowWrapper } from './GlowWrapper'
import { Drawer } from './Header/Drawer'
import { NetworkNotice } from './Header/NetworkNotice'

type Props = {
  readonly children: ReactNode
}

export const LayoutClient = ({ children }: Props) => {
  useEffect(() => {
    resetRecoil(poolState)

    getRecoilPromise(
      getTokenBySymbol(constants.initialTokens.tokenA.symbol)
    ).then((tokenA) => {
      setPoolState({
        tokenA
      })
    })

    getRecoilPromise(
      getTokenBySymbol(constants.initialTokens.tokenB.symbol)
    ).then((tokenB) => {
      setPoolState({
        tokenB
      })
    })
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
