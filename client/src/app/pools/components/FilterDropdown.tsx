import { authState } from '@/features/auth/auth.state'
import { getPoolsFilter } from '@/features/pool/selectors/getPoolsFromApi'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilState, useRecoilValue } from 'recoil'

export const FilterDropdown = () => {
  const [{ myPoolsCheck }, setCheck] = useRecoilState(getPoolsFilter)

  const { isAuthenticated } = useRecoilValue(authState)

  const handleMyPools = () => {
    setCheck((prev) => ({ ...prev, myPoolsCheck: !myPoolsCheck }))
  }

  return (
    <div className="dropdown dropdown-end">
      <label
        className="flex flex-row items-center justify-center gap-2 rounded py-1 px-5 truncate max-w-[170px] bg-[var(--green-black)] hover:bg-[var(--brand-blue)] opacity-60 hover:opacity-100 hover:cursor-pointer transition ease-in-out duration-300"
        tabIndex={0}
      >
        Filter
        <FontAwesomeIcon className="h-[12px] w-[12px]" icon={faFilter} />
      </label>
      <ul
        className="dropdown-content z-[100] menu form-control w-[160px] p-3 shadow bg-[var(--brand-blue)] rounded [&>*:first"
        tabIndex={0}
      >
        <li>
          <span className="opacity-60">Filter by</span>
        </li>
        {Boolean(isAuthenticated) && (
          <li>
            <label className="text-xs cursor-pointer label">
              <input
                checked={myPoolsCheck}
                className="checkbox h-[20px] w-[20px] rounded"
                onChange={handleMyPools}
                type="checkbox"
              />
              <span className="text-xs opacity-60">My Pools</span>
            </label>
          </li>
        )}
      </ul>
    </div>
  )
}
