import { Spinner } from '@/components/Spinner'
import { poolState } from '@/features/pool/pool.state'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

export const StakingDetails = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)
  const { state, contents } = useRecoilValueLoadable(
    getUserStakingPoolInfoSelector({ tokenA, tokenB })
  )
  if (state === 'loading') {
    return (
      <div className="min-w-full">
        <Skeleton
          baseColor="#192026"
          count={5}
          height="35px"
          highlightColor="#283336"
        />
      </div>
    )
  }

  if (state === 'hasValue' && tokenA.amount) {
    return (
      <div className="bg-[var(--green-black)] min-h-[180px] max-w-[400px]">
        <div className="flex flex-col justify-between w-full gap-2 mx-auto ">
          {[
            {
              leftText: `Pool Tokens Supply`,
              rightText: `${Number(contents.totalSupply)}`
            },
            {
              leftText: `Stake Amount`,
              rightText: `${Number(contents.stakeAmount)}`
            },
            {
              leftText: `Time Span start`,
              rightText: `${Number(contents.start)}`
            },
            {
              leftText: `Time Span end`,
              rightText: `${Number(contents.end)}`
            }
          ].map((e, index) => (
            <div
              className="grid items-center min-w-full grid-cols-3"
              key={index}
            >
              <p className="text-xs opacity-60 max-w-[80px]">{e.leftText}</p>
              <div className="h-[1px] opacity-40 bg-[#757575] w-full" />
              <p className="text-sm text-right opacity-60">{e.rightText}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return <Spinner />
}
