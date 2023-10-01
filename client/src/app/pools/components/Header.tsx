'use client'
import { getPoolsFilter } from '@/features/pool/selectors/getStoredPools.selector'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent, useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { resetRecoil } from 'recoil-nexus'
import { FilterDropdown } from './FilterDropdown'

export const Header = () => {
  useEffect(() => {
    resetRecoil(getPoolsFilter)
  }, [])

  const handleInputChange = useRecoilCallback(
    ({ set }) =>
      ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
        set(getPoolsFilter, (prev) => ({
          ...prev,
          tokenName: currentTarget.value
        }))
      }
  )

  return (
    <div className="flex flex-col items-center justify-between w-full gap-2 mb-2 lg:mb-5 lg:gap-10 lg:flex-row">
      <div className="group flex justify-start items-center rounded bg-[var(--dark-black)] w-full lg:w-4/5 px-3 opacity-80 tooltip tooltip-right ease-in-out duration-300 border border-1 border-[#d9d9d9]/20">
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
      <div className="flex items-center justify-center w-1/5 lg:justify-end">
        <FilterDropdown />
        {/* <SortDropdown /> */}
      </div>
    </div>
  )
}
