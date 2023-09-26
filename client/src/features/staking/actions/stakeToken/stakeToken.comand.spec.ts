import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { StakeTokenCommand, stakeTokenCommand } from './stakeToken.command'

jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/contracts/services/dexPool/DexPoolContractService')
jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/features/ui/loading.state')

describe('When stakeTokenCommand is called', () => {
  const initialState = {
    sharesToStake: 1,
    poolAddress: 'mockPoolAddress',
    stakeDuration: 1,
    stakePoolContractService,
    transactionHash: ''
  } as StakeTokenCommand

  it('and is successful', async () => {
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    jest
      .mocked(stakePoolContractService.stakingPoolExists)
      .mockResolvedValue(true)

    await stakeTokenCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.sharesToStaking is missing', async () => {
    const state = {
      ...initialState,
      sharesToStaking: undefined
    }

    await expect(stakeTokenCommand(state as any)).rejects.toThrow(
      'Shares to staking is required'
    )
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(stakeTokenCommand(state)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.stakeDuration is missing', async () => {
    const state = {
      ...initialState,
      stakeDuration: undefined
    }

    await expect(stakeTokenCommand(state as any)).rejects.toThrow(
      'Duration is required'
    )
  })
})
