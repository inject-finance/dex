import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { removeLiquidity } from './removeLiquidity.action'
import { removeLiquidityCommand } from './removeLiquidity.command '
import { storeRemoveLiquidityCommand } from './storeRemoveLiquidity.command'

jest.mock('@/features/auth/auth.state')
jest.mock('@/features/liquidity/liquidity.state')
jest.mock('@/features/pool/pool.state')
jest.mock('../../../ui/loading.state')
jest.mock('@/features/common/process/create-command.stack')

describe('When removeLiquidity is called', () => {
  const initialState = {
    account: { address: 'mockAddress' } as User,
    tokenA: {} as Token,
    tokenB: {} as Token,
    shares: 0,
    dexPoolContractService,
    routerContractService,
    gasUsed: 0,
    poolAddress: ''
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await removeLiquidity({
      tokenA: initialState.tokenA,
      tokenB: initialState.tokenB,
      shares: initialState.shares,
      account: initialState.account,
      poolAddress: initialState.poolAddress
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(2)
    expect(commandStack.add).toHaveBeenCalledWith(removeLiquidityCommand)
    expect(commandStack.add).toHaveBeenCalledWith(storeRemoveLiquidityCommand)
  })
})
