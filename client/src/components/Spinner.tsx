import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Props {
  readonly text?: string
}
export const Spinner = ({ text }: Props) => (
  <span className="flex items-center">
    <FontAwesomeIcon
      className="animate-spin min-h-[20px] min-w-[20px] h-[20px] w-[20px] max-h-[20px] max-w-[20px] mr-2 text-[var(--light-yellow)]"
      icon={faSpinner}
    />
    {text ?? <span className="opacity-60">Loading...</span>}
  </span>
)
