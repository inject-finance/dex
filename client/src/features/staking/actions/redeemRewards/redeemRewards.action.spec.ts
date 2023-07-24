import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { redeemRewards } from './redeemRewards.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/features/ui/loading.state')

describe('When redeemRewards is called', () => {
  const initialState = {
    tokenA: {
      address: 'mockTokenAAddress',
      symbol: 'mockTokenASymbol'
    } as Token,
    tokenB: {
      address: 'mockTokenBAddress',
      symbol: 'mockTokenBSymbol'
    } as Token,
    account: { address: 'mockAccountAddress' } as User,
    stakePoolContractService
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await redeemRewards({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      account: initialState.account
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(2)
  })
})
