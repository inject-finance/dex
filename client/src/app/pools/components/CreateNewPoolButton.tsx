'use client'
import { authState } from '@/features/auth/auth.state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'

export const CreateNewPoolButton = () => {
  const { account } = useRecoilValue(authState)

  if (
    account.address ===
    process.env.NEXT_PUBLIC_ADDRESS_STAKING_OWNER?.toLocaleLowerCase()
  ) {
    return (
      <button className="group min-w-[32px]">
        <Link className="w-full h-full" href="/create-new-pool">
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
              Create New Pool
            </span>
          </div>
        </Link>
      </button>
    )
  }

  return null
}
