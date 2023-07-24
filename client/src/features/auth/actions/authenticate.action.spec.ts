import { User } from '@/common/types/User'
import { setAuthState, setIsLoadingAuth } from '../auth.state'
import { authService } from '../services/auth-service/AuthService'
import { authenticate } from './authenticate.action'

jest.mock('../auth.state')
jest.mock('../services/auth-service/AuthService')
jest.mock('../../../common/services/local-storage/LocalStorage.service')
jest.mock('../services/metamask-service/MetamaskService')

describe('When signInAction is called', () => {
  const mockAddress = '0x12345'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('and is successful', async () => {
    const payload = {
      token: 'token',
      account: { address: mockAddress } as User
    }

    jest.mocked(authService.authenticateLocalToken).mockResolvedValue(payload)

    await authenticate(mockAddress)

    expect(authService.authenticateLocalToken).toHaveBeenCalledWith(mockAddress)
    expect(setIsLoadingAuth).toHaveBeenCalledWith(true)
    expect(setAuthState).toHaveBeenCalledWith({
      isAuthenticated: Boolean(payload?.token),
      account: { ...payload?.account, address: mockAddress } as User,
      isLoading: false
    })
  })
})
