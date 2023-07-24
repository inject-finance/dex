import { authService } from '@/features/auth/services/auth-service/AuthService'
import { setAuthState, setIsLoadingAuth } from '../auth.state'
import { rejectMetamaskRequest } from '../utils/rejectMetamaskRequest'
import { metamaskService } from '../services/metamask-service/MetamaskService'

export const signIn = async (address: string) => {
  try {
    setIsLoadingAuth(true)
    const nonce = await authService.getNonce(address)
    const signature = await metamaskService.getSignature(nonce)

    if (!signature) {
      throw new Error(
        'An error has occurred while signing your message. Please try again.'
      )
    }

    const account = await authService.signIn(signature, nonce)

    setAuthState({
      isAuthenticated: true,
      account
    })
  } catch (error) {
    rejectMetamaskRequest(error)
  } finally {
    setIsLoadingAuth(false)
  }
}
