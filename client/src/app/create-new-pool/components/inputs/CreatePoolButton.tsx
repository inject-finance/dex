'use client'
import { AddLiquidityButton } from '@/app/liquidity/components/AddLiquidityButton'
import { ApproveTokenButton } from '@/app/liquidity/components/ApproveTokenButton'
import { buttonWithAuth } from '@/components/ButtonWithAuth'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { ErrorButton } from '@/components/buttons/ErrorButton'
import { LoadingButton } from '@/components/buttons/LoadingButton'
import { createPoolAction } from '@/features/liquidity/action/createPool/createPool.action'
import { getPairAllowanceSelector } from '@/features/liquidity/selectors/getAllowance.selector'
import { poolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getStoredPoolsSelector } from '@/features/pool/selectors/getStoredPools.selector'
import {
  getHasReservesSelector,
  getReservesSelector
} from '@/features/pool/selectors/getReserves.selector'
import { getOutAmountSelector } from '@/features/swap/selectors/getOutAmount.selector'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import {
  getTokensInPoolSelector,
  getTokensWithoutPoolSelector
} from '@/features/tokens/selectors/getStoredTokens.selector'
import { toggleConfirmationModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const CreatePoolButton = dynamic(
  () =>
    Promise.resolve(
      buttonWithAuth(() => {
        const allowance = useRecoilValue(getPairAllowanceSelector)
        const { tokenA, tokenB } = useRecoilValue(poolState)
        const poolAddress = useRecoilValue(
          getPoolAddressSelector({ tokenA, tokenB })
        )
        const balanceA = useRecoilValue(getBalanceSelector(tokenA))
        const balanceB = useRecoilValue(getBalanceSelector(tokenB))
        const hasReserves = useRecoilValue(
          getHasReservesSelector({ tokenA, tokenB })
        )
        const handleCreatePoolClick = useRecoilCallback(
          ({ refresh }) =>
            async () => {
              try {
                await createPoolAction({
                  tokenA,
                  tokenB
                })

                toggleConfirmationModalVisibility()
              } finally {
                refresh(getReservesSelector({ tokenA, tokenB }))
                refresh(getOutAmountSelector)
                refresh(getTokensInPoolSelector)
                refresh(getTokensWithoutPoolSelector)
                refresh(getSharesSelector({ tokenA, tokenB }))
                refresh(getPairAllowanceSelector)
                refresh(getStoredPoolsSelector)
              }
            }
        )

        if (poolAddress && !hasReserves) {
          return <AddLiquidityButton />
        }

        if (poolAddress) {
          return <ErrorButton text="Pool already exist" />
        }

        if (!tokenA.amount || !tokenB.amount) {
          return <ErrorButton text="Please type an amount" />
        }

        if (Number(tokenA.amount) > balanceA) {
          return <ErrorButton text={`Insufficient ${tokenA.symbol} balance`} />
        }

        if (Number(tokenB.amount) > balanceB) {
          return <ErrorButton text={`Insufficient ${tokenB.symbol} balance`} />
        }

        if (
          tokenA.symbol !== 'ETH' &&
          Number(tokenA.amount) > allowance.allowanceA
        ) {
          return (
            <ApproveTokenButton amount={Number(tokenA.amount)} token={tokenA} />
          )
        }

        if (
          tokenB.symbol !== 'ETH' &&
          Number(tokenB.amount) > allowance.allowanceB
        ) {
          return (
            <ApproveTokenButton amount={Number(tokenB.amount)} token={tokenB} />
          )
        }

        return (
          <>
            <ActionButton
              className="w-full"
              icon={faCoins}
              onClick={toggleConfirmationModalVisibility}
              title="Create"
            />
            <ConfirmationModal handleConfirmation={handleCreatePoolClick}>
              This action
              <span className="text-[var(--light-yellow)]"> can not</span> be
              <span className="text-[var(--light-blue)]"> undone</span>. Are you
              sure you want to create a pool using these tokens{' '}
              <span className="text-[var(--light-yellow)]">
                {tokenA.symbol}
              </span>{' '}
              and{' '}
              <span className="text-[var(--light-blue)]"> {tokenB.symbol}</span>
              ?
            </ConfirmationModal>
          </>
        )
      })
    ),
  { ssr: false, loading: () => <LoadingButton /> }
)
