'use client'
import { CreatePositionModal } from '@/app/pools/components/CreatePositionModal'
import { Spinner } from '@/components/Spinner'
import { getStoredPoolsSelector } from '@/features/pool/selectors/getStoredPools.selector'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValueLoadable } from 'recoil'
import { PoolCard } from './PoolCard/PoolCard'
import { RedeemRewardsModal } from './RedeemRewardsModal'
import { RemoveLiquidityModal } from './RemoveLiquidityModal'
import { SetStakeableModal } from './SetStakeableModal'

export const PoolTable = () => {
  const { state, contents } = useRecoilValueLoadable(getStoredPoolsSelector)

  if (state === 'loading' || state !== 'hasValue') {
    return (
      <ul className="max-h-[280px] overflow-y-hidden flex justify-center">
        <Spinner />
      </ul>
    )
  }

  return (
    <div className="max-h-[340px] overflow-auto pr-5">
      {Boolean(contents.length) &&
        contents.map((e) => <PoolCard key={e.id} pool={e} />)}

      {!contents.length && (
        <div className="flex flex-col items-center justify-center w-full p-5 text-center opacity-60">
          <span className="text-3xl text-[var(--light-yellow)]">
            Uh <span className="text-[var(--light-blue)]">oh...</span>
          </span>
          <br />
          Search Not Found <FontAwesomeIcon icon={faCircleQuestion} />
        </div>
      )}

      <RedeemRewardsModal />
      <RemoveLiquidityModal />
      <CreatePositionModal />
      <SetStakeableModal />
    </div>
  )
}
