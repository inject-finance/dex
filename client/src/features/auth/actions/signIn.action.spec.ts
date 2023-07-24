import { User } from '@/common/types/User'
import { setAuthState, setIsLoadingAuth } from '../auth.state'
import { authService } from '../services/auth-service/AuthService'
import { signIn } from './signIn.action'
import { metamaskService } from '../services/metamask-service/MetamaskService'

jest.mock('../auth.state')
jest.mock('../services/auth-service/AuthService')
jest.mock('../../../common/services/local-storage/LocalStorage.service')
jest.mock('../services/metamask-service/MetamaskService')

describe('When signInAction is called', () => {
  const mockAddress = '0x12345'
  const mockNonce = 'nonce'
  const mockSignature = 'signature'

  it('and is successful', async () => {
    const account = {
      address: mockAddress
    } as User

    metamaskService.getSignature = jest.fn().mockResolvedValue(mockSignature)
    authService.getNonce = jest.fn().mockResolvedValue(mockNonce)
    authService.signIn = jest.fn().mockResolvedValue(account)

    await signIn(mockAddress)

    expect(setIsLoadingAuth).toHaveBeenCalledWith(true)
    expect(metamaskService.getSignature).toHaveBeenCalledWith(mockNonce)
    expect(authService.getNonce).toHaveBeenCalledWith(mockAddress)
    expect(authService.signIn).toHaveBeenCalledWith(mockSignature, mockNonce)
    expect(setAuthState).toHaveBeenCalledWith({
      account,
      isAuthenticated: true
    })
  })

  it('and got an invalid signature', async () => {
    metamaskService.getSignature = jest.fn().mockResolvedValue(null)
    authService.getNonce = jest.fn().mockResolvedValue(mockNonce)

    await expect(signIn(mockAddress)).rejects.toThrow(
      'An error has occurred while signing your message. Please try again.'
    )

    expect(setIsLoadingAuth).toHaveBeenCalledWith(true)
    expect(metamaskService.getSignature).toHaveBeenCalledWith(mockNonce)
    expect(authService.getNonce).toHaveBeenCalledWith(mockAddress)
  })
})
