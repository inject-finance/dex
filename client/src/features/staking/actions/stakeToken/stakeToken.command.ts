import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { IDexPoolContractService } from '@/contracts/services/dexPool/IDexPoolContractService'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type StakeTokenCommand = {
  sharesToStake: number
  poolAddress?: string
  stakeDuration: number
  transactionHash?: string
  account: User
  stakePoolContractService: IStakePoolContractService
  dexPoolContractService: IDexPoolContractService
} & TokenPair
export const stakeTokenCommand: Command<StakeTokenCommand> = async (state) => {
  if (!state.sharesToStake)
    throw new ValidationError('Shares to staking is required')
  if (!state.poolAddress)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.stakeDuration) throw new ValidationError('Duration is required')

  setIsLoading('We are approving shares')

  const transactionApproval =
    await state.dexPoolContractService.approveAmountToStake({
      sharesToStake: state.sharesToStake,
      account: state.account,
      poolAddress: state.poolAddress,
      tokenA: state.tokenA,
      tokenB: state.tokenB
    })

  setIsLoading('Approving Transaction')
  await processTransaction(transactionApproval)

  setIsLoading('We are staking shares')
  const transaction = await state.stakePoolContractService.stakeToken({
    duration: state.stakeDuration,
    poolAddress: state.poolAddress,
    shares: state.sharesToStake
  })

  setIsLoading('We are processing your receipt')

  return processTransaction(transaction).then(({ transactionHash }) => ({
    ...state,
    transactionHash
  }))
}
