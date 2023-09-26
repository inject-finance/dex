/* eslint-disable no-console */
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type ClaimRewardsCommand = {
  transactionHash: string
  poolAddress: string
  stakePoolContractService: IStakePoolContractService
}

export const claimRewardsCommand: Command<ClaimRewardsCommand> = async (
  state
) => {
  const { poolAddress, stakePoolContractService } = state

  if (!poolAddress) {
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  }

  setIsLoading('We are redeeming rewards')

  const transaction = await stakePoolContractService.claimRewards(poolAddress)

  setIsLoading('We are creating your receipt')
  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
