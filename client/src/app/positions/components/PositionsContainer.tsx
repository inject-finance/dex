'use client'
import { FilterDropdown } from '@/app/pools/components/FilterDropdown'
import { SortDropdown } from '@/app/pools/components/SortDropdown'
import { authState } from '@/features/auth/auth.state'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { PositionsTable } from './PositionsTable'

export const PositionsContainer = () => {
  const { isAuthenticated } = useRecoilValue(authState)

  const handleInputChange = useRecoilCallback(() => () => {
    // set(getPoolsFilter, currentTarget.value)
  })

  return (
    <>
      <div className="flex flex-col items-center justify-between w-full gap-2 mb-2 lg:mb-5 lg:gap-10 lg:flex-row">
        <div className="group flex justify-start items-center rounded bg-[var(--dark-black)] w-full px-3 opacity-80 tooltip tooltip-right ease-in-out duration-300 border border-1 border-[#d9d9d9]/20">
          <FontAwesomeIcon
            className="opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90 max-h-[16px] max-w-[16px]"
            color="#339EA8"
            icon={faMagnifyingGlass}
          />
          <input
            className="w-full pr-2 bg-transparent border-none input focus:outline-none placeholder:opacity-60 placeholder:text-left disabled:bg-transparent"
            onChange={handleInputChange}
            placeholder="Search Pools"
            type="text"
          />
        </div>

        <div className="flex flex-row items-center justify-center w-1/5 lg:justify-end">
          <FilterDropdown />
          <SortDropdown />
        </div>
      </div>
      {Boolean(isAuthenticated) && <PositionsTable />}
    </>
  )
}
