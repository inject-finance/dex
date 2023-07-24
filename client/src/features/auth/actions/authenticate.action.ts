import { User } from '@/common/types/User'
import { authService } from '@/features/auth/services/auth-service/AuthService'
import { setAuthState, setIsLoadingAuth } from '../auth.state'

export const authenticate = async (address: string) => {
  setIsLoadingAuth(true)

  const payload = await authService.authenticateLocalToken(address)

  setAuthState({
    isAuthenticated: Boolean(payload?.token),
    account: { ...payload?.account, address } as User,
    isLoading: false
  })
}
