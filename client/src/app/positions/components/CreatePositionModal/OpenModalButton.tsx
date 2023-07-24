'use client'
import { toggleCreatePositionModalVisibility } from '@/features/ui/ui.state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const OpenModalButton = () => (
  <button
    className="group min-w-[32px]"
    onClick={toggleCreatePositionModalVisibility}
  >
    <div
      className="flex flex-row items-center justify-center py-1 px-2 w-full text-md rounded-full opacity-60 bg-gradient-to-br from-[var(--light-blue)] to-[var(--brand-yellow)] hover:opacity-100"
      id="createBtn"
    >
      <FontAwesomeIcon
        className="max-h-[18px] max-w-[18px] transition ease-in-out duration-500 group-hover:rotate-90"
        icon={faPlus}
      />
      <span className="flex gap-1">
        <p />
        Create Position
      </span>
    </div>
  </button>
)
