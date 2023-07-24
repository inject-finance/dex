import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { processTransaction } from '@/features/common/utils/processTransaction'
import {
  ClaimRewardsCommand,
  claimRewardsCommand
} from './redeemRewards.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/contracts/services/stake/StakePoolContractService')
jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/features/ui/loading.state')

describe('When claimRewardsCommand is called', () => {
  const initialState = {
    poolAddress: 'mockPoolAddress',
    stakePoolContractService,
    transactionHash: ''
  } as ClaimRewardsCommand

  it('and is successful', async () => {
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    await claimRewardsCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(claimRewardsCommand(state)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })
})
