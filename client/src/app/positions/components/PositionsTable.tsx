'use client'
import { Spinner } from '@/components/Spinner'
import { getUserPositionsSelector } from '@/features/staking/selectors/getUserPositions.selector'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { PositionPoolDetails } from './PositionPoolDetails'

export const PositionsTable = () => {
  const { state, contents } = useRecoilValueLoadable(getUserPositionsSelector)

  return (
    <div className="max-h-[340px] overflow-auto pr-5">
      {(state === 'loading' || state !== 'hasValue') ?? <Spinner />}
      {state === 'hasValue' &&
        Boolean(contents.pools.length) &&
        contents.pools.map((e) => (
          <Fragment key={e.id}>
            <PositionPoolDetails pool={e} />
            <br />
          </Fragment>
        ))}

      {state === 'hasValue' && !contents.pools.length && (
        <div className="flex flex-col items-center justify-center w-full p-5 text-center opacity-60">
          <span className="text-3xl text-[var(--light-yellow)]">
            Uh <span className="text-[var(--light-blue)]">oh...</span>
          </span>
          <br />
          Search Not Found{' '}
          <FontAwesomeIcon className="" icon={faCircleQuestion} />
        </div>
      )}

      {/* <RemoveLiquidityModal /> */}
    </div>
  )
}
