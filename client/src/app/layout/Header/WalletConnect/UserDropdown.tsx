import { authState } from '@/features/auth/auth.state'
import { useRecoilValue } from 'recoil'

export const UserDropdown = () => {
  const {
    account: { address }
  } = useRecoilValue(authState)

  return (
    <div
      className="h-auto min-h-[30px] w-[140px] rounded py-1 px-5 truncate max-w-[170px] bg-[var(--green-black)] tooltip"
      data-tip="Disconnect your Metamask Account to Log Out"
    >
      <span className="transition duration-300 ease-in-out opacity-60">{`${address.substring(
        0,
        5
      )}...${address.slice(-5)}`}</span>
    </div>
  )
}
