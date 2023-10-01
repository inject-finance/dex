/* eslint-disable no-console */
import { Pool } from '@/common/types/Pool'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type ClaimRewardsCommand = {
  transactionHash: string
  pool: Pool
  stakePoolContractService: IStakePoolContractService
}

export const claimRewardsCommand: Command<ClaimRewardsCommand> = async (
  state
) => {
  if (!state.pool?.address) {
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  }

  setIsLoading('We are redeeming rewards')

  const transaction = await state.stakePoolContractService.claimRewards(
    state.pool.address
  )

  setIsLoading('We are creating your receipt')
  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
