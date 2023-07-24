'use client'

import { type Token } from '@/common/types/Token'
import { Spinner } from '@/components/Spinner'
import { TokenIcon } from '@/components/TokenList/TokenIcon'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { faCoins, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValueLoadable } from 'recoil'

type Props = { tokenA: Token; tokenB: Token }

export const PositionPoolDetails: React.FC<Props> = ({ tokenA, tokenB }) => {
  const { state, contents } = useRecoilValueLoadable(
    getPoolDetailsSelector({ tokenA, tokenB })
  )

  if (state === 'hasValue') {
    return (
      <div
        className={`collapse collapse-arrow rounded-md bg-[var(--dark-green)] ${
          contents.isStakeable ? 'opacity-40' : ''
        }`}
      >
        <input type="checkbox" />
        {contents.isStakeable ? (
          <div className="tooltip tooltip-top" data-tip="Staking...">
            <FontAwesomeIcon
              className="text-[var(--light-yellow)]"
              icon={faLock}
            />
          </div>
        ) : (
          <div className="tooltip tooltip-top" data-tip="Stakable">
            <FontAwesomeIcon
              className="text-[var(--light-yellow)]"
              icon={faCoins}
            />
          </div>
        )}
        <div className="flex flex-row items-center justify-start gap-3 collapse-title text-md">
          <div className="flex relattive mr-5">
            <span className="z-0">
              <TokenIcon token={tokenA} />
            </span>
            <span className="absolute z-10 left-8">
              <TokenIcon token={tokenB} />
            </span>
          </div>
          <h4>
            {tokenA.symbol} / {tokenB.symbol}
          </h4>
        </div>

        <div className="flex flex-row w-full collapse-content md:flex-col">
          <div>
            <h3 className="mb-2 text-xs opacity-80">
              <strong>Pool Address:</strong> {contents.poolAddress}
            </h3>
            <span className="flex my-2 text-xs opacity-40">
              <strong>Note:</strong> The values in this table are aproximates,
              to see the actual values, hover the desired CELL NAME
            </span>
          </div>

          <div className="flex flex-col w-1/2 text-sm md:flex-row md:w-full md:justify-between bg-[#181818]/60 rounded-tl-md rounded-bl-md md:rounded-bl-none md:rounded-tr-md">
            <div
              className="text-center p-1 border-b border-b-[var(--light-blue)] md:w-1/3 md:border-b-0 md:border-r md:border-r-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip={`${contents.shares} Pool Token`}
            >
              Pool Shares
            </div>
            <div
              className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Staking"
            >
              Staking
            </div>
            <div
              className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Rewards"
            >
              Pending Rewards
            </div>
          </div>
          <div className="flex flex-col w-1/2 md:flex-row md:w-full md:justify-between bg-[#181818]/30 rounded-br-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
            <div className="text-center p-1 border-b border-b-[var(--light-yellow)] md:w-1/3 md:border-b-0 md:border-r-1 md:border-r-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
              <span className="opacity-80">
                {contents.sharesInPercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
              <span className="opacity-80">{contents.shares.toFixed(2)}</span>
            </div>
            <div className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
              <span className="opacity-80">
                {contents.totalSupply.toFixed(2)}
              </span>
            </div>
          </div>

          {/* {!contents.isStakeable && (
            <div className="flex flex-row items-center gap-3 pt-5">
              {Boolean(Number(contents.shares.toFixed(8))) && (
                <AddStakingModal />
              )}

              {Boolean(Number(contents.shares.toFixed(8))) && (
                <label
                  className="flex text-xs underline transition duration-300 ease-in-out opacity-40 hover:opacity-80 hover:cursor-pointer"
                  htmlFor="remove_liquidity"
                  onClick={openRemoveLiquidityModal}
                >
                  Remove Liquidity
                </label>
              )}
              <label
                className="flex text-xs underline transition duration-300 ease-in-out opacity-40 hover:opacity-80 hover:cursor-pointer"
                onClick={openSetStakingModal}
              >
                Set Staking
              </label>
            </div>
          )} */}
          {/* {contents.isStakeable ?? (
            <div>
              <StakingDetailsModal />
            </div>
          )} */}
        </div>
      </div>
    )
  }

  return <Spinner />
}
