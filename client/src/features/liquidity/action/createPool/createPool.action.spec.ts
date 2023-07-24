import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { addLiquidityCommand } from '../addLiquidity/addLiquidity.command'
import { storeLiquidityCommand } from '../addLiquidity/storeLiquidity.command'
import { CreatePoolAction, createPoolAction } from './createPool.action'
import { createPoolCommand } from './createPool.command'
import { storePoolCommand } from './storePool.command'

jest.mock('@/features/auth/auth.state')
jest.mock('@/features/liquidity/liquidity.state')
jest.mock('@/features/pool/pool.state')
jest.mock('../../../ui/loading.state')
jest.mock('@/features/common/process/create-command.stack')

describe('When createPoolAction is called', () => {
  const initialState = {
    account: { address: 'mockAddress' } as User,
    tokenA: {} as Token,
    tokenB: {} as Token,
    poolFactoryContractService,
    routerContractService,
    transactionHash: '',
    poolAddress: ''
  } as CreatePoolAction

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await createPoolAction({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      account: initialState.account,
      poolAddress: initialState.poolAddress
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(4)
    expect(commandStack.add).toHaveBeenCalledWith(createPoolCommand)
    expect(commandStack.add).toHaveBeenCalledWith(storePoolCommand)
    expect(commandStack.add).toHaveBeenCalledWith(addLiquidityCommand)
    expect(commandStack.add).toHaveBeenCalledWith(storeLiquidityCommand)
  })
})
