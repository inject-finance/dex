import { authState, setIsMounted } from '@/features/auth/auth.state'
import { useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'
import { ConnectButton } from './ConnectButton'
import { UserDropdown } from './UserDropdown'

export const WalletConnect = () => {
  const { isAuthenticated, isLoading, isMounting } = useRecoilValue(authState)

  useEffect(() => {
    setIsMounted()
  }, [])

  if (isLoading || isMounting) {
    return (
      <Skeleton
        baseColor="#192026"
        className="min-h-[30px]"
        highlightColor="#283336"
        style={{ width: '120px', minHeight: '30px', maxHeight: '30px' }}
      />
    )
  }

  if (!isLoading && !isAuthenticated) {
    return <ConnectButton />
  }

  return <UserDropdown />
}
