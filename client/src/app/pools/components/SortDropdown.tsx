import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SortDropdown = () => (
  <div className="dropdown dropdown-end">
    <label
      className="flex flex-row items-center justify-center gap-2 rounded py-1 px-5 truncate max-w-[170px] bg-[var(--green-black)] hover:bg-[var(--brand-blue)] opacity-60 hover:opacity-100 hover:cursor-pointer transition ease-in-out duration-300"
      tabIndex={0}
    >
      Sort
      <FontAwesomeIcon className="h-[12px] w-[12px]" icon={faSort} />
    </label>
    <ul
      className="dropdown-content z-[100] menu form-control w-[160px] p-3 shadow bg-[var(--brand-blue)] rounded"
      tabIndex={0}
    >
      <li>
        <span className="opacity-60">Sort by:</span>
      </li>
      <li>
        <label className="text-xs cursor-pointer label">
          <input
            className="checkbox h-[20px] w-[20px] rounded"
            type="checkbox"
          />
          <span className="text-xs opacity-60">My Shares ↓</span>
        </label>
      </li>
      <li>
        <label className="text-xs cursor-pointer label">
          <input
            className="checkbox h-[20px] w-[20px] rounded"
            type="checkbox"
          />
          <span className="text-xs opacity-60">My Shares ↑</span>
        </label>
      </li>
    </ul>
  </div>
)
