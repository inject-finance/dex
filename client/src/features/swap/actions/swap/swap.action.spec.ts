import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { swapAction } from './swap.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/router/RouterContractService')
jest.mock('@/contracts/services/token/TokenContractService')
jest.mock('@/contracts/services/dexPool/DexPoolContractService')
jest.mock('@/features/ui/loading.state')

describe('When swapAction is called', () => {
  const initialState = {
    tokenA: {
      address: 'mockTokenAAddress',
      symbol: 'mockTokenASymbol',
      amount: '1'
    } as Token,
    tokenB: {
      address: 'mockTokenBAddress',
      symbol: 'mockTokenBSymbol',
      amount: '1'
    } as Token,
    account: { address: 'mockAccountAddress' } as User,
    slippage: 0.5,
    transactionHash: '',
    tokenContractService,
    routerContractService,
    dexPoolContractService
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await swapAction({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      account: initialState.account,
      slippage: initialState.slippage
    })

    expect(commandStack.add).toHaveBeenCalledTimes(2)
  })
})
