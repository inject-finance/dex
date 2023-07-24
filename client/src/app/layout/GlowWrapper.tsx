'use client'
import blueGlow from '@/assets/images/blue_glow.png'
import yellowGlow from '@/assets/images/yellow_glow.png'
import { SpinnerContainer } from '@/components/SpinnerContainer'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { loadingState } from '@/features/ui/loading.state'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { resetRecoil } from 'recoil-nexus'

type Props = {
  children: ReactNode
}

export const GlowWrapper = ({ children }: Props) => {
  const isLoading = useRecoilValue(loadingState)
  const { isMounting } = useRecoilValue(authState)

  const pathname = usePathname()

  useEffect(() => {
    resetRecoil(poolState)
  }, [pathname])

  if (pathname === '/') {
    return children
  }

  return (
    <div className="max-w-[1024px] m-auto">
      <div className="relative">
        <div className="flex">
          <div className="absolute z-0 top-[calc(50%_-_400px)] lg:top-[calc(50%_-_300px)] lg:left-[calc(50%_-_480px)] left-[calc(50%_-_260px)] md:left-[calc(50%_-_340px)] w-[600px] lg:w-[320px]">
            <Image
              alt="dex_glow"
              className="h-[800px] lg:h-[600px] animate-[pulse_3s_ease-in-out_infinite]"
              priority
              src={blueGlow}
            />
          </div>
          <div className="absolute z-0 top-[calc(50%_-_400px)] lg:top-[calc(50%_-_300px)] lg:right-[calc(50%_-_477px)] right-[calc(50%_-_480px)] md:right-[calc(50%_-_560px)] w-[600px] lg:w-[320px]">
            <Image
              alt="dex_glow"
              className="h-[800px] lg:h-[600px] animate-[pulse_3s_ease-in-out_infinite]"
              priority
              src={yellowGlow}
            />
          </div>
        </div>
        <SpinnerContainer
          isLoading={isLoading.status || isMounting}
          text={isLoading.text}
        >
          {children}
        </SpinnerContainer>
      </div>
    </div>
  )
}
