'use client'
import { authState } from '@/features/auth/auth.state'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly handleClick: () => void
}
export const MaxButton = ({ handleClick }: Props) => {
  const { isAuthenticated } = useRecoilValue(authState)

  if (!isAuthenticated) {
    return null
  }

  return (
    <button
      className="p-2 text-sm text-[var(--light-yellow)] bg-transparent opacity-40 transition ease-in-out duration-300 hover:opacity-100"
      onClick={handleClick}
      type="button"
    >
      max
    </button>
  )
}
