'use client'
import { ExchangeCard } from '@/app/swap/components/ExchangeCard'
import { InputA } from '@/components/InputA'
import { SwitchComponent } from '@/components/SwitchComponent'
import { TokenList } from '@/components/TokenList/TokenList'
import { TokenPicker } from '@/components/TokenPicker'
import { VerticalSeparator } from '@/components/VerticalSeparator'
import { GlowComponentHeader } from '@/components/containers/GlowComponentHeader'
import { poolState } from '@/features/pool/pool.state'
import { getTokensWithoutPoolSelector } from '@/features/tokens/selectors/getTokensFromApi.selector'
import { useRecoilValue } from 'recoil'
import { CreateNewPoolDetails } from './CreateNewPoolDetails'
import { CreatePoolButton } from './inputs/CreatePoolButton'
import { InputB } from './inputs/InputB'
import { useEffect } from 'react'
import { authState } from '@/features/auth/auth.state'
import { useRouter } from 'next/navigation'

export const CreateNewPoolContainer = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)
  const { account } = useRecoilValue(authState)
  const router = useRouter()

  useEffect(() => {
    if (
      account.address !==
      process.env.NEXT_PUBLIC_ADDRESS_STAKING_OWNER?.toLocaleLowerCase()
    ) {
      router.back()
    }
  }, [account.address, router])

  return (
    <div className="h-auto mx-auto bg-[var(--green-black)] rounded-md p-5 flex flex-col gap-10 w-full min-h-[430px] md:min-w-[440px] lg:min-w-[840px]">
      <GlowComponentHeader />
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col w-full lg:w-4/5">
          <div className="min-h-[250px] flex flex-col gap-5 relative">
            <ExchangeCard title="Token A">
              <TokenPicker token={tokenA} />
              <InputA />
            </ExchangeCard>
            <SwitchComponent />

            <ExchangeCard title="Token B">
              <TokenPicker token={tokenB} />
              <InputB />
            </ExchangeCard>
          </div>

          <TokenList selector={getTokensWithoutPoolSelector} />
        </div>
        <VerticalSeparator />
        <div className="min-h-[250px] lg:w-4/5 flex flex-col items-center justify-between">
          <CreateNewPoolDetails />
          <CreatePoolButton />
        </div>
      </div>
    </div>
  )
}
