'use client'
import { Spinner } from '@/components/Spinner'
import { poolState } from '@/features/pool/pool.state'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { faClock, faCoins, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { PoolSelector } from './PoolSelector'

export const PoolSelectorSection = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)

  const { state } = useRecoilValueLoadable(
    getPoolDetailsSelector({ tokenA, tokenB })
  )
  // eslint-disable-next-line react/hook-use-state
  const [, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
  }, [tokenA, tokenB])

  if (state === 'loading' || state !== 'hasValue') {
    return <Spinner />
  }

  return (
    <div className="flex flex-col gap-3 pb-5">
      <div className="my-2">
        <h4 className="flex flex-row items-center gap-1 mb-2 text-sm opacity-90">
          Select Pool{' '}
          <FontAwesomeIcon
            className="text-[var(--light-blue)] opacity-60"
            icon={faClock}
          />
        </h4>
        <span className="text-sm opacity-60">
          A <span className="text-[var(--light-blue)]">Pool</span> is required
          to add staking to a tokens pool. Specified shares in this field will
          be{' '}
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

      <PoolSelector />
    </div>
  )
}
