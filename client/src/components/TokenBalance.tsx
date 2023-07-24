'use client'
import { type Token } from '@/common/types/Token'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import {
  faCircleQuestion,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'

import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'

type Props = {
  token: Token
}
export const TokenBalance = dynamic(
  () =>
    Promise.resolve(({ token }: Props) => {
      const balance = useRecoilValue(getBalanceSelector(token))

      if (!balance) {
        return <div className="pr-5 min-h-[30px] w-[129px] h-[30px]" />
      }

      if (Number(token.amount) > balance) {
        return (
          <div
            className="pr-5 text-xs font-regular min-h-[30px] max-w-[142px] tooltip tooltip-bottom"
            data-tip={`${balance} ${token.symbol}`}
          >
            <span className="opacity-80">
              <FontAwesomeIcon
                className="mr-1 text-[var(--light-yellow)]"
                icon={faExclamationCircle}
              />
              Insufficient Balance
            </span>
          </div>
        )
      }

      return (
        <div
          className="flex justify-end pr-5 text-xs font-regular min-h-[30px] h-[30px] w-[129px] tooltip tooltip-bottom hover:cursor-pointer"
          data-tip={`${balance} ${token.symbol}`}
        >
          <span className="opacity-40">
            <FontAwesomeIcon className="mr-1" icon={faCircleQuestion} />
            Balance: {formatQuantity(balance)} {token.symbol}
          </span>
        </div>
      )
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-[30xp] max-h-[30px]">
        <Skeleton
          baseColor="#192026"
          className="min-h-[30px] max-h-[30px]"
          height={30}
          highlightColor="#283336"
          width={142}
        />
      </div>
    )
  }
)
