'use client'
import { type Token } from '@/common/types/Token'
import { CancelButton } from '@/components/buttons/CancelButton'
import { setPoolState } from '@/features/pool/pool.state'
import { toggleRemoveLiquidityModalVisibility } from '@/features/ui/ui.state'
import { useRecoilCallback } from 'recoil'

type Props = { tokenA: Token; tokenB: Token; shares: number }

export const RemoveLiquidityButton: React.FC<Props> = ({
  tokenA,
  tokenB,
  shares
}) => {
  const onClickButton = useRecoilCallback(() => () => {
    setPoolState({ tokenA, tokenB })
    toggleRemoveLiquidityModalVisibility()
  })

  if (Number(shares.toFixed(8))) {
    return (
      <CancelButton
        className="w-1/2 md:w-fit"
        title="Remove Liquidity"
        toggle={onClickButton}
      />
    )
  }

  return null
}
