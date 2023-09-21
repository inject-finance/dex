'use client'
import { type Token } from '@/common/types/Token'
import { authState } from '@/features/auth/auth.state'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { SetStakingButton } from '../SetStakingPoolModal/SetStakingButton'
import { Details } from './Details'
import { Header } from './Header'
import { OpenStakeModalButton } from './OpenStakeModalButton'
import { RemoveLiquidityButton } from './RemoveLiquidityButton'
import { StakingDetailsButton } from './StakingDetailsButton'

type Props = { tokenA: Token; tokenB: Token }

export const PoolCard: React.FC<Props> = ({ tokenA, tokenB }) => {
  const { state, contents } = useRecoilValueLoadable(
    getPoolDetailsSelector({ tokenA, tokenB })
  )
  const { isAuthenticated } = useRecoilValue(authState)

  if (state === 'loading' || state !== 'hasValue') {
    return (
      <Skeleton
        baseColor="#192026"
        highlightColor="#283336"
        style={{ width: '100%', minHeight: '60px' }}
      />
    )
  }

  return (
    <div
      className={`collapse collapse-arrow rounded-md bg-[var(--dark-green)] mb-3 
      ${
        Number(contents.pendingRewards)
          ? 'opacity-40 border border-[#339ea8]/80'
          : ''
      }
      `}
    >
      <input type="checkbox" />
      <Header tokenA={tokenA} tokenB={tokenB} />

      <div className="w-[300px] sm:w-full collapse-content md:flex-col">
        <Details tokenA={tokenA} tokenB={tokenB} />

        {isAuthenticated ? (
          <div className="flex flex-row items-center w-full gap-3 pt-5 md:w-auto">
            <OpenStakeModalButton tokenA={tokenA} tokenB={tokenB} />
            <StakingDetailsButton tokenA={tokenA} tokenB={tokenB} />
            <RemoveLiquidityButton
              shares={contents.shares}
              tokenA={tokenA}
              tokenB={tokenB}
            />
            <SetStakingButton
              isStakeable={contents.isStakeable}
              tokenA={tokenA}
              tokenB={tokenB}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
