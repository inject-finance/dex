'use client'
import { buttonWithAuth } from '@/components/ButtonWithAuth'
import { ActionButton } from '@/components/buttons/ActionButton'
import { ErrorButton } from '@/components/buttons/ErrorButton'
import { LoadingButton } from '@/components/buttons/LoadingButton'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { swapAction } from '@/features/swap/actions/swap/swap.action'
import { getOutAmountSelector } from '@/features/swap/selectors/getOutAmount.selector'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { getPriceSelector } from '@/features/tokens/selectors/getPrice.selector'
import { toggleConfirmationModalVisibility } from '@/features/ui/ui.state'
import { faShuffle } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { ConfirmationModal } from '../../../components/ConfirmationModal'

export const SwapButton = dynamic(
  () =>
    Promise.resolve(
      buttonWithAuth(() => {
        const { tokenA, tokenB } = useRecoilValue(poolState)
        const balance = useRecoilValue(getBalanceSelector(tokenA))

        const handleSwapClick = useRecoilCallback(
          ({ refresh, snapshot }) =>
            async () => {
              try {
                const { tokenA, tokenB, slippage } = await snapshot.getPromise(
                  poolState
                )
                const { account } = await snapshot.getPromise(authState)
                const { total } = await snapshot.getPromise(
                  getOutAmountSelector
                )

                await swapAction({
                  tokenA,
                  tokenB: { ...tokenB, amount: String(total) },
                  account,
                  slippage: Number(slippage)
                })

                toggleConfirmationModalVisibility()
              } finally {
                refresh(getBalanceSelector(tokenA))
                refresh(getBalanceSelector(tokenB))
                refresh(getPriceSelector(tokenB))
                refresh(getOutAmountSelector)
              }
            }
        )

        if (!tokenA.amount) {
          return <ErrorButton text="Please type an amount" />
        }

        if (Number(tokenA.amount) > Number(balance)) {
          return <ErrorButton text={`Insufficient ${tokenA.symbol} balance`} />
        }

        return (
          <>
            <ActionButton
              className="w-full"
              icon={faShuffle}
              onClick={toggleConfirmationModalVisibility}
              title="Swap"
            />
            <ConfirmationModal handleConfirmation={handleSwapClick}>
              This action
              <span className="text-[var(--light-yellow)]"> can not</span> be
              <span className="text-[var(--light-blue)]"> undone</span>. Are you
              sure you want to swap{' '}
              <span className="text-[var(--light-yellow)]">
                {tokenA.symbol}
              </span>{' '}
              for{' '}
              <span className="text-[var(--light-blue)]"> {tokenB.symbol}</span>
              ?
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
