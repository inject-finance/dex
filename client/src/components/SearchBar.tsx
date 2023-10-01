import { getTokensByNameFilter } from '@/features/tokens/selectors/getStoredTokens.selector'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type ChangeEvent } from 'react'
import { useRecoilCallback } from 'recoil'

export const SearchBar = () => {
  const handleInputChange = useRecoilCallback(
    ({ set }) =>
      ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
        set(getTokensByNameFilter, currentTarget.value)
      }
  )

  return (
    <div className="group flex justify-start items-center w-full rounded bg-[var(--dark-black)] px-3 opacity-80 tooltip tooltip-right ease-in-out duration-300 border border-1 border-[#d9d9d9]/20 mb-5">
      <FontAwesomeIcon
        className="opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
        color="#339EA8"
        icon={faMagnifyingGlass}
      />
      <input
        className="w-full pr-2 bg-transparent border-none input focus:outline-none placeholder:opacity-60 placeholder:text-left disabled:bg-transparent"
        onChange={handleInputChange}
        placeholder="Search tokens..."
        type="text"
      />
    </div>
  )
}
