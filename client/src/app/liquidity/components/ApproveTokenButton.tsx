'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { LoadingButton } from '@/components/buttons/LoadingButton'
import { authState } from '@/features/auth/auth.state'
import { approveToken } from '@/features/liquidity/action/approveToken/approveToken.action'
import {
  getAllowanceSelector,
  getPairAllowanceSelector
} from '@/features/liquidity/selectors/getAllowance.selector'
import { poolState } from '@/features/pool/pool.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import { useRecoilCallback } from 'recoil'

interface Props {
  token: Token
  amount: number
}
export const ApproveTokenButton = dynamic(
  () =>
    Promise.resolve(({ token, amount }: Props) => {
      const onClickApproveToken = useRecoilCallback(
        ({ snapshot, refresh }) =>
          async () => {
            try {
              const { account } = await snapshot.getPromise(authState)
              await approveToken({
                token: { ...token, amount: String(amount) },
                owner: account
              })
            } finally {
              refresh(poolState)
              refresh(getPairAllowanceSelector)
              refresh(
                getAllowanceSelector({ ...token, amount: String(amount) })
              )
            }
          }
      )

      return (
        <div className="w-full">
          <ActionButton
            className="w-full"
            icon={faCoins}
            onClick={onClickApproveToken}
            title={`Approve ${token.symbol}`}
          />
        </div>
      )
    }),
  { ssr: false, loading: () => <LoadingButton /> }
)
