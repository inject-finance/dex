import { setSwapState } from '@/features/swap/swap.state'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const RefreshButton = () => (
  <button
    className="group flex items-center justify-center h-[30px] w-[30px] p-1 text-lg rounded-full transition duration-120 ease-out opacity-60 hover:ease-in hover:opacity-90 hover:bg-[var(--bg-black)] tooltip tooltip-top"
    data-tip="Refresh prices"
    onClick={() => {
      setSwapState({})
    }}
  >
    <FontAwesomeIcon
      className="max-h-[18px] max-w-[18px] transition ease-in-out duration-300 group-hover:rotate-180"
      icon={faArrowRotateRight}
    />
  </button>
)
