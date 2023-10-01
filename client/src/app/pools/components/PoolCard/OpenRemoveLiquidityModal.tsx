'use client'
import { type Token } from '@/common/types/Token'
import { CancelButton } from '@/components/buttons/CancelButton'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import { toggleRemoveLiquidityModalVisibility } from '@/features/ui/ui.state'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly tokenA: Token
  readonly tokenB: Token
}

export const OpenRemoveLiquidityModal = ({ tokenA, tokenB }: Props) => {
  const { shares } = useRecoilValue(getSharesSelector({ tokenA, tokenB }))

  if (Number(shares.toFixed(8))) {
    return (
      <CancelButton
        className="w-1/2 md:w-fit"
        title="Remove Liquidity"
        toggle={toggleRemoveLiquidityModalVisibility}
      />
    )
  }

  return null
}
