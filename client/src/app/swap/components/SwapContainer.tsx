'use client'
import { InputA } from '@/components/InputA'
import { SwitchComponent } from '@/components/SwitchComponent'
import { TokenList } from '@/components/TokenList/TokenList'
import { TokenPicker } from '@/components/TokenPicker'
import { VerticalSeparator } from '@/components/VerticalSeparator'
import { GlowComponentHeader } from '@/components/containers/GlowComponentHeader'
import { poolState } from '@/features/pool/pool.state'
import { getTokensInPoolSelector } from '@/features/tokens/selectors/getStoredTokens.selector'
import { useRecoilValue } from 'recoil'
import { ExchangeCard } from './ExchangeCard'
import { SwapButton } from './SwapButton'
import { TradeDetails } from './TradeDetails'
import { InputOut } from './inputs/InputOut'

export const SwapContainer = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)

  return (
    <div className="h-auto mx-auto bg-[var(--green-black)] rounded-md p-5 flex flex-col gap-10 min-h-[426.5px] sm:min-w-[440px] lg:min-w-[854px] lg:max-w-[854px]">
      <GlowComponentHeader />
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col w-full lg:w-4/5">
          <div className="min-h-[300px] flex flex-col gap-5 relative">
            <ExchangeCard title="You Send">
              <TokenPicker token={tokenA} />
              <InputA />
            </ExchangeCard>

            <SwitchComponent />

            <ExchangeCard title="You Receive">
              <TokenPicker token={tokenB} />
              <InputOut />
            </ExchangeCard>
          </div>

          <TokenList selector={getTokensInPoolSelector} />
        </div>
        <VerticalSeparator />
        <div className="min-h-[300px] lg:w-4/5 flex flex-col items-center justify-between">
          <TradeDetails />
          <SwapButton />
        </div>
      </div>
    </div>
  )
}
