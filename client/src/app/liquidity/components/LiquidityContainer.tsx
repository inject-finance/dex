'use client'

import { LiquidityDetails } from '@/app/liquidity/components/LiquidityDetails'
import { ExchangeCard } from '@/app/swap/components/ExchangeCard'
import { InputA } from '@/components/InputA'
import { SwitchComponent } from '@/components/SwitchComponent'
import { TokenList } from '@/components/TokenList/TokenList'
import { TokenPicker } from '@/components/TokenPicker'
import { VerticalSeparator } from '@/components/VerticalSeparator'
import { GlowComponentHeader } from '@/components/containers/GlowComponentHeader'
import { poolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getTokensInPoolSelector } from '@/features/tokens/selectors/getTokensFromApi.selector'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { AddLiquidityButton } from './AddLiquidityButton'
import { InputB } from './Inputs/InputB'
import { PoolAddressNotice } from './PoolAddressNotice'

export const LiquidityContainer = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)
  const { contents: poolAddress } = useRecoilValueLoadable(
    getPoolAddressSelector({ tokenA, tokenB })
  )

  return (
    <div className="h-auto mx-auto bg-[var(--green-black)] rounded-md p-5 flex flex-col gap-10 w-full lg:min-h-[478.5px] lg:max-h-[478.5px]  md:min-w-[440px] lg:min-w-[840px] lg:max-w-[840px]">
      <GlowComponentHeader />
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col w-full lg:w-4/5">
          <div className="min-h-[300px] flex flex-col gap-5 relative">
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
          <PoolAddressNotice poolAddress={poolAddress} />
          <TokenList selector={getTokensInPoolSelector} />
        </div>
        <VerticalSeparator />
        <div className="min-h-[300px] lg:w-4/5 flex flex-col items-center justify-between">
          <LiquidityDetails />

          <AddLiquidityButton />
        </div>
      </div>
    </div>
  )
}
