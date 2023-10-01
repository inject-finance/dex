'use client'
import { type Token } from '@/common/types/Token'
import { Spinner } from '@/components/Spinner'
import { TokenIcon } from '@/components/TokenList/TokenIcon'
import { getIsStakeablePoolSelector } from '@/features/staking/selectors/getIsStakeablePool.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { faCoins, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useRecoilValue } from 'recoil'

interface Props {
  tokenA: Token
  tokenB: Token
}

export const Header = dynamic(
  () =>
    Promise.resolve(({ tokenA, tokenB }: Props) => {
      const { stakedAmount } = useRecoilValue(
        getUserStakingPoolInfoSelector({ tokenA, tokenB })
      )
      const isStakeable = useRecoilValue(
        getIsStakeablePoolSelector({ tokenA, tokenB })
      )

      return (
        <div className="flex flex-row items-center justify-start gap-3 collapse-title text-md">
          <div className="relative flex mr-5">
            <span className="z-0">
              <TokenIcon token={tokenA} />
            </span>
            <span className="absolute z-10 left-8">
              <TokenIcon token={tokenB} />
            </span>
          </div>
          <h4 className="flex">
            {tokenA.symbol} /{tokenB.symbol}
          </h4>

          {isStakeable && !Number(stakedAmount) ? (
            <span className="flex flex-row items-center gap-2 border border-1 rounded-full border-[#FDD981]/60 text-xs opacity-80 py-1 px-2">
              Stakeable Pool
              <FontAwesomeIcon
                className="text-[var(--light-yellow)] opacity-80"
                icon={faCoins}
              />
            </span>
          ) : null}

          {isStakeable && Number(stakedAmount) ? (
            <span className="flex flex-row items-center gap-1 border border-1 rounded-full border-[#339EA8]/60 text-xs opacity-80 py-1 px-2">
              Staking In Progress
              <FontAwesomeIcon
                className="text-[var(--light-blue)] opacity-80"
                icon={faLock}
              />
            </span>
          ) : null}
        </div>
      )
    }),
  { ssr: false, loading: () => <Spinner /> }
)
