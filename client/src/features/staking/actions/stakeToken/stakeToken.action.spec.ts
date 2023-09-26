import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { stakeToken } from './stakeToken.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/features/ui/loading.state')

describe('When stakeToken is called', () => {
  const initialState = {
    tokenA: {
      address: 'mockTokenAAddress',
      symbol: 'mockTokenASymbol'
    } as Token,
    tokenB: {
      address: 'mockTokenBAddress',
      symbol: 'mockTokenBSymbol'
    } as Token,
    stakeDuration: 0,
    sharesToStaking: 0,
    stakePoolContractService,
    poolAddress: 'mockPoolAddress',
    account: { address: 'mockAccountAddress' } as User
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await stakeToken({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      stakeDuration: initialState.stakeDuration,
      sharesToStake: initialState.sharesToStaking,
      poolAddress: initialState.poolAddress
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(2)
  })
})
