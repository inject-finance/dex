import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { processTransaction } from '@/features/common/utils/processTransaction'
import {
  SetStakingCommand,
  setStakingCommand
} from './setAsStakeablePool.command'

jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/contracts/services/inject/InjectTokenContractService')
jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/features/ui/loading.state')

describe('When setStakingCommand is called', () => {
  const initialState = {
    poolAddress: 'mockPoolAddress',
    initialDeposit: 10,
    minStakeAmount: 0,
    interestRate: 2,
    minReserve: 0,
    stakePoolContractService,
    transactionHash: ''
  } as SetStakingCommand

  it('and is successful', async () => {
    const transaction = {
      wait: jest.fn()
    }
    const contractReceipt = {
      transactionHash: 'mockTransactionHash'
    }
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    await transaction.wait()

    jest
      .mocked(stakePoolContractService.setStakingPool)
      .mockResolvedValue(transaction as any)

    jest.mocked(transaction.wait).mockResolvedValue(contractReceipt)

    await setStakingCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.initialDeposit is less than 10', async () => {
    const state = {
      ...initialState,
      initialDeposit: 9
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      'Minimal initial deposit is 10'
    )
  })

  it('and fails when state.interestRate is less than 2', async () => {
    const state = {
      ...initialState,
      interestRate: 1
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      'Minimal interestRate 2%'
    )
  })

  it('and fails when state.interestRate is greater than 10', async () => {
    const state = {
      ...initialState,
      interestRate: 11
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      'Maximum interestRate 10%'
    )
  })

  it('and fails when state.minStakeAmount is less than 0', async () => {
    const state = {
      ...initialState,
      minStakeAmount: -1
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      'Minimal Stake Amount is required'
    )
  })

  it('and fails when state.minReserve is less than 0', async () => {
    const state = {
      ...initialState,
      minReserve: -1
    }

    await expect(setStakingCommand(state)).rejects.toThrow(
      'Minimal min reserve is 0'
    )
  })
})
