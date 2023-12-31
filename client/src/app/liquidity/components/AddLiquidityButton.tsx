'use client'
import { buttonWithAuth } from '@/components/ButtonWithAuth'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { ErrorButton } from '@/components/buttons/ErrorButton'
import { LoadingButton } from '@/components/buttons/LoadingButton'
import { addLiquidityAction } from '@/features/liquidity/action/addLiquidity/addLiquidity.action'
import { getPairAllowanceSelector } from '@/features/liquidity/selectors/getAllowance.selector'
import { getRatioSelector } from '@/features/liquidity/selectors/getRatio.selector'
import { poolState } from '@/features/pool/pool.state'
import { getReservesSelector } from '@/features/pool/selectors/getReserves.selector'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import { toggleConfirmationModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { ApproveTokenButton } from './ApproveTokenButton'

export const AddLiquidityButton = dynamic(
  () =>
    Promise.resolve(
      buttonWithAuth(() => {
        const pathname = usePathname()
        const { tokenA, tokenB } = useRecoilValue(poolState)
        const ratio = useRecoilValue(getRatioSelector)
        const allowance = useRecoilValue(getPairAllowanceSelector)
        const balanceA = useRecoilValue(getBalanceSelector(tokenA))
        const balanceB = useRecoilValue(getBalanceSelector(tokenB))
        const handleConfirmClick = useRecoilCallback(
          ({ snapshot, refresh }) =>
            async () => {
              const { tokenA, tokenB } = await snapshot.getPromise(poolState)
              try {
                const ratio = await snapshot.getPromise(getRatioSelector)
                await addLiquidityAction({
                  tokenA,
                  tokenB: {
                    ...tokenB,
                    amount:
                      pathname === '/liquidity' ? String(ratio) : tokenB.amount
                  }
                })

                toggleConfirmationModalVisibility()
              } finally {
                refresh(getBalanceSelector(tokenA))
                refresh(getBalanceSelector(tokenB))
                refresh(getReservesSelector({ tokenA, tokenB }))
                refresh(getSharesSelector({ tokenA, tokenB }))
                refresh(getRatioSelector)
              }
            }
        )

        if (!tokenA.amount) {
          return <ErrorButton text="Please type an amount" />
        }

        if (Number(tokenA.amount) > balanceA) {
          return <ErrorButton text={`Insufficient ${tokenA.symbol} balance`} />
        }

        if (ratio > balanceB) {
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

        if (tokenB.symbol !== 'ETH' && Number(ratio) > allowance.allowanceB) {
          return <ApproveTokenButton amount={Number(ratio)} token={tokenB} />
        }

        return (
          <>
            <ActionButton
              className="w-full"
              icon={faCoins}
              onClick={toggleConfirmationModalVisibility}
              title="Add Liquidity"
            />
            <ConfirmationModal handleConfirmation={handleConfirmClick}>
              {' '}
              This action{' '}
              <span className="text-[var(--light-yellow)]"> can not</span> be
              <span className="text-[var(--light-blue)]"> undone</span>. Are you
              sure you want to add liquidity?
            </ConfirmationModal>
          </>
        )
      })
    ),
  {
    ssr: false,
    loading: () => <LoadingButton />
  }
)
