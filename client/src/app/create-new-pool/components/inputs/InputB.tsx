'use client'
import { poolState, setPoolState } from '@/features/pool/pool.state'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type ChangeEvent } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { getRecoilPromise } from 'recoil-nexus'
import { TokenBalance } from '../../../../components/TokenBalance'

export const InputB = () => {
  const { tokenB } = useRecoilValue(poolState)

  const handleInputChange = useRecoilCallback(
    ({ set }) =>
      ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
        const { value } = currentTarget

        if (isNaN(Number(value))) {
          return
        }

        set(poolState, (prev) => ({
          ...prev,
          tokenB: { ...tokenB, amount: value }
        }))
      }
  )
  const handleMaxButton = async () => {
    const balance = await getRecoilPromise(getBalanceSelector(tokenB))

    setPoolState({
      tokenB: { ...tokenB, amount: String(balance) }
    })
  }

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
            value={tokenB.amount}
          />

          <button
            className="p-2 text-sm text-[var(--light-yellow)] bg-transparent opacity-40 hover:opacity-100"
            onClick={handleMaxButton}
          >
            max
          </button>
        </div>
        <TokenBalance token={tokenB} />
      </div>
    </div>
  )
}
