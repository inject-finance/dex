'use client'
import { poolState, setPoolState } from '@/features/pool/pool.state'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { MaxButton } from './MaxButton'
import { TokenBalance } from './TokenBalance'

export const InputA = () => {
  const { tokenA } = useRecoilValue(poolState)

  const handleMaxButton = useRecoilCallback(({ snapshot }) => async () => {
    const balance = await snapshot.getPromise(getBalanceSelector(tokenA))

    setPoolState({
      tokenA: { ...tokenA, amount: String(balance) }
    })
  })

  const handleInputChange = useRecoilCallback(
    () =>
      ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
        const { value } = currentTarget

        if (isNaN(Number(value))) {
          return
        }

        setPoolState({
          tokenA: { ...tokenA, amount: value }
        })
      }
  )
  return (
    <div className="w-full">
      <div className="flex flex-col items-end justify-end gap-3 group">
        <div className="flex justify-end items-center w-full rounded bg-[var(--green-black)] px-3 tooltip tooltip-top ease-in-out duration-300 border border-transparent focus-within:border-[#339ea8]/50">
          <FontAwesomeIcon
            className="max-w-[16px] max-h-[16px] opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
            color="#339EA8"
            icon={faPen}
          />
          <input
            className="w-full pr-2 text-sm bg-transparent border-none input focus:outline-none placeholder:opacity-60 disabled:bg-transparent"
            onChange={handleInputChange}
            placeholder="Amount"
            value={String(tokenA.amount || '')}
          />
          <MaxButton handleClick={handleMaxButton} />
        </div>
        <TokenBalance token={tokenA} />
      </div>
    </div>
  )
}
