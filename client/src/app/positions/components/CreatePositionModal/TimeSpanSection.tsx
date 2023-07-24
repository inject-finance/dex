'use client'
import { poolState } from '@/features/pool/pool.state'
import { faClock, faCoins, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const TimeSpanSection = () => {
  const { staking } = useRecoilValue(poolState)

  const onChangeSelect = useRecoilCallback(
    ({ set }) =>
      (e: ChangeEvent<HTMLSelectElement>) => {
        set(poolState, (prev) => ({
          ...prev,
          staking: { ...staking, duration: Number(e.currentTarget.value) }
        }))
      }
  )

  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="my-2">
        <h4 className="flex flex-row items-center gap-1 mb-2 text-sm opacity-90">
          Time Span{' '}
          <FontAwesomeIcon
            className="text-[var(--light-blue)] opacity-60"
            icon={faClock}
          />
        </h4>
        <span className="text-sm opacity-60">
          A <span className="text-[var(--light-blue)]">Time Span</span> is
          required to add staking to a tokens pool. Specified shares in this
          field will be{' '}
          <span className="text-[var(--light-yellow)]">
            LOCKED <FontAwesomeIcon icon={faLock} />{' '}
          </span>
          for the selected{' '}
          <span className="text-[var(--light-blue)]">Time Span</span> to ensure{' '}
          <span className="text-[var(--light-yellow)]">
            Rewards <FontAwesomeIcon icon={faCoins} />{' '}
          </span>
        </span>
      </div>

      <select
        className="[&>option]:p-5 w-full rounded select opacity-60 hover:opacity-90 focus:opacity-90 focus:border-[var(--light-blue)] bg-[var(--dark-green)] transition ease-in-out duration-300"
        onChange={onChangeSelect}
        value={staking.duration}
      >
        {/* <option disabled selected>
          Select Time Span
        </option> */}
        <option value={30}>30 Days</option>
        <option value={60}>60 Days</option>
        <option value={90}>90 Days</option>
      </select>
    </div>
  )
}
