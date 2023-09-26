import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { setAsStakeable } from './setAsStakeablePool.action'

jest.mock('@/features/common/process/create-command.stack')
jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/features/ui/loading.state')

describe('When setStakingPool is called', () => {
  const initialState = {
    initialDeposit: 0,
    minStakeAmount: 0,
    interestRate: 0,
    minReserve: 0,
    stakePoolContractService,
    poolAddress: 'mockPoolAddress'
  }

  it('and is successful', async () => {
    const commandStack = {
      add: jest.fn(),
      run: jest.fn()
    }
    jest.mocked(createCommandStack).mockReturnValue(commandStack)
    jest.mocked(commandStack.add).mockReturnValue(commandStack)
    commandStack.run.mockResolvedValue(initialState)

    await setAsStakeable({
      initialDeposit: initialState.initialDeposit,
      minStakeAmount: initialState.minStakeAmount,
      interestRate: initialState.interestRate,
      minReserve: initialState.minReserve,
      poolAddress: initialState.poolAddress
    })

    expect(createCommandStack).toHaveBeenCalledWith(initialState)
    expect(commandStack.add).toHaveBeenCalledTimes(1)
  })
})
