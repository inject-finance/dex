'use client'
import { poolState } from '@/features/pool/pool.state'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent } from 'react'
import { useRecoilCallback, useRecoilState } from 'recoil'
import { TokenBalance } from './TokenBalance'
import { setRecoil } from 'recoil-nexus'
import { MaxButton } from './MaxButton'

export const InputA = () => {
  const [{ tokenA }, setState] = useRecoilState(poolState)

  const handleMaxButton = useRecoilCallback(({ snapshot }) => async () => {
    const balance = await snapshot.getPromise(getBalanceSelector(tokenA))

    setState((prev) => ({
      ...prev,
      tokenA: { ...tokenA, amount: String(balance) }
    }))
  })

  const handleInputChange = useRecoilCallback(
    () =>
      ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
        const { value } = currentTarget

        if (isNaN(Number(value))) {
          return
        }

        setRecoil(poolState, (prev) => ({
          ...prev,
          tokenA: { ...tokenA, amount: value }
        }))
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
