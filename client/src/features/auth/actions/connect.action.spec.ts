import { setIsLoadingAuth } from '../auth.state'
import { metamaskService } from '@/features/auth/services/metamask-service/MetamaskService'
import { authenticate } from './authenticate.action'
import { connect } from './connect.action'

jest.mock('../auth.state')
jest.mock('../../../common/services/local-storage/LocalStorage.service')
jest.mock('@/features/auth/services/metamask-service/MetamaskService')
jest.mock('./authenticate.action')

describe('When signInAction is called', () => {
  const mockAddress = '0x12345'

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('and is successful', async () => {
    const provider = { send: jest.fn() }

    jest.mocked(metamaskService.getProvider).mockReturnValue(provider as any)

    provider.send.mockResolvedValue([mockAddress])

    await connect()

    expect(metamaskService.getProvider).toHaveBeenCalled()
    expect(authenticate).toHaveBeenCalledWith(mockAddress)
    expect(setIsLoadingAuth).toHaveBeenCalledWith(true)
  })
})
