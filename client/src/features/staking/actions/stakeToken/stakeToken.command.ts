import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type StakeTokenCommand = {
  sharesToStaking: number
  poolAddress?: string
  stakeDuration: number
  transactionHash?: string
  stakePoolContractService: IStakePoolContractService
}
export const stakeTokenCommand: Command<StakeTokenCommand> = async (state) => {
  if (!state.sharesToStaking)
    throw new ValidationError('Shares to staking is required')
  if (!state.poolAddress)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.stakeDuration) throw new ValidationError('Duration is required')

  // Step: 1 = Check
  setIsLoading('We are checking availability on this pool')
  const stakingPoolExists =
    await state.stakePoolContractService.stakingPoolExists(state.poolAddress)

  if (!stakingPoolExists) {
    throw new ValidationError(CommandsError.STAKING_POOL_DOES_NOT_AVAILABLE)
  }

  // Step 2 Approve
  setIsLoading('We are approving shares')
  await dexPoolContractService.init(state.poolAddress)
  const transactionApproval = await dexPoolContractService.approveStakePool(
    state.sharesToStaking
  )

  setIsLoading('Approving Transaction')
  await processTransaction(transactionApproval)

  setIsLoading('We are staking shares')
  const transaction = await state.stakePoolContractService.stakeToken({
    duration: state.stakeDuration,
    poolAddress: state.poolAddress,
    shares: state.sharesToStaking
  })

  setIsLoading('We are processing your receipt')
  await processTransaction(transaction).then(({ transactionHash }) => {
    state.transactionHash = transactionHash
  })

  return state
}
