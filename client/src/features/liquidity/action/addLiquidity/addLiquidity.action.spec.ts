import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { addLiquidity } from './addLiquidity.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/router/RouterContractService')
jest.mock('@/features/ui/loading.state')

describe('When addLiquidity is called', () => {
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
    routerContractService,
    poolAddress: 'mockPoolAddress',
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

    await addLiquidity({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      account: initialState.account,
      poolAddress: initialState.poolAddress
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(2)
  })
})
