import { Pool } from '@/common/types/Pool'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { setIsLoading } from '@/features/ui/loading.state'

export type CheckStakingPoolAvailabilityCommand = {
  pool: Pool
  stakePoolContractService: IStakePoolContractService
}
export const checkStakingPoolAvailabilityCommand: Command<
  CheckStakingPoolAvailabilityCommand
> = async (state) => {
  if (!state.pool?.address)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)

  setIsLoading('We are checking availability on this pool')
  const stakingPoolExists =
    await state.stakePoolContractService.stakingPoolExists(state.pool?.address)

  if (!stakingPoolExists) {
    throw new ValidationError(CommandsError.STAKEABLE_POOL_DOES_NOT_AVAILABLE)
  }

  return state
}
