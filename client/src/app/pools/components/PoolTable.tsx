'use client'
import { CreatePositionModal } from '@/app/positions/components/CreatePositionModal/CreatePositionModal'
import { Spinner } from '@/components/Spinner'
import { getPoolsSelector } from '@/features/pool/selectors/getPoolsFromApi'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { PoolCard } from './PoolCard/PoolCard'
import { StakingDetailsModal } from './PoolCard/StakingDetailsModal'
import { RemoveLiquidityModal } from './RemoveLiquidityModal'
import { SetStakingPoolModal } from './SetStakingPoolModal/SetStakingPoolModal'

export const PoolTable = () => {
  const { state, contents } = useRecoilValueLoadable(getPoolsSelector)

  if (state === 'loading' || state !== 'hasValue') {
    return (
      <ul className="max-h-[280px] overflow-y-hidden flex justify-center">
        <Spinner />
      </ul>
    )
  }

  return (
    <div className="max-h-[340px] overflow-auto pr-5">
      {Boolean(contents.pools.length) &&
        contents.pools.map((e) => (
          <PoolCard key={e.id} tokenA={e.tokenA} tokenB={e.tokenB} />
        ))}

      {!contents.pools.length && (
        <div className="flex flex-col items-center justify-center w-full p-5 text-center opacity-60">
          <span className="text-3xl text-[var(--light-yellow)]">
            Uh <span className="text-[var(--light-blue)]">oh...</span>
          </span>
          <br />
          Search Not Found{' '}
          <FontAwesomeIcon className="" icon={faCircleQuestion} />
        </div>
      )}

      <StakingDetailsModal />
      <RemoveLiquidityModal />
      <CreatePositionModal />
      <SetStakingPoolModal />
    </div>
  )
}
