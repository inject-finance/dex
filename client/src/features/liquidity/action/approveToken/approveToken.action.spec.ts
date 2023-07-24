import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { approveToken } from './approveToken.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/dexPool/DexPoolContractService')
jest.mock('@/contracts/services/token/TokenContractService')
jest.mock('@/features/ui/loading.state')

describe('When approveToken is called', () => {
  const initialState = {
    token: { address: 'mockTokenAddress', symbol: 'mockTokenSymbol' } as Token,
    tokenContractService,
    dexPoolContractService,
    account: { address: 'mockAccountAddress' } as User,
    transactionHash: ''
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await approveToken({
      token: initialState.token,
      owner: initialState.account
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(1)
    expect(commandStack.run).toHaveBeenCalledTimes(1)
  })
})
