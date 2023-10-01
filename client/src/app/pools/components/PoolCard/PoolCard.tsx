'use client'
import { Pool } from '@/common/types/Pool'
import { authState } from '@/features/auth/auth.state'
import { setPoolState } from '@/features/pool/pool.state'
import { getTotalRewardsSelector } from '@/features/staking/selectors/getTotalRewards.selector'
import { useRecoilValue } from 'recoil'
import { Details } from './Details'
import { Header } from './Header'
import { OpenRemoveLiquidityModal } from './OpenRemoveLiquidityModal'
import { OpenSetStakeableModal } from './OpenSetStakeableModal'
import { OpenCreatePositionModal } from './OpenCreatePositionModal'
import { OpenRedeemRewardsModal } from './OpenRedeemRewardsModal'

interface Props {
  readonly pool: Pool
}

export const PoolCard = ({ pool }: Props) => {
  const { tokenA, tokenB } = pool
  const { isAuthenticated } = useRecoilValue(authState)
  const pendingRewards = useRecoilValue(
    getTotalRewardsSelector({ tokenA, tokenB })
  )

  const handleSelectPool = () => {
    setPoolState({ tokenA, tokenB })
  }

  return (
    <div
      className={`collapse collapse-arrow rounded-md bg-[var(--dark-green)] mb-3 
      ${Number(pendingRewards) ? 'opacity-40 border border-[#339ea8]/80' : ''}`}
      onClick={handleSelectPool}
    >
      <input type="checkbox" />
      <Header tokenA={tokenA} tokenB={tokenB} />

      <div className="w-[300px] sm:w-full collapse-content md:flex-col">
        <Details pool={pool} />

        {Boolean(isAuthenticated) && (
          <div className="flex flex-row items-center w-full gap-3 pt-5 md:w-auto">
            <OpenCreatePositionModal tokenA={tokenA} tokenB={tokenB} />
            <OpenRedeemRewardsModal tokenA={tokenA} tokenB={tokenB} />
            <OpenRemoveLiquidityModal tokenA={tokenA} tokenB={tokenB} />
            <OpenSetStakeableModal tokenA={tokenA} tokenB={tokenB} />
          </div>
        )}
      </div>
    </div>
  )
}
