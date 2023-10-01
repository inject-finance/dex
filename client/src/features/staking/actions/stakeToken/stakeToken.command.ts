import { Pool } from '@/common/types/Pool'
import { PositionDurationAndAmount } from '@/common/types/Position'
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
  position: PositionDurationAndAmount
  transactionHash?: string
  account: User
  stakePoolContractService: IStakePoolContractService
  dexPoolContractService: IDexPoolContractService
  pool: Pool
} & TokenPair
export const stakeTokenCommand: Command<StakeTokenCommand> = async (state) => {
  if (!state.position.amount)
    throw new ValidationError(CommandsError.POSITION_AMOUNT_REQUIRED)
  if (state.position.duration < 30)
    throw new Error('The minimal duration is 30 days')
  if (!state.pool?.address)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)

  setIsLoading('We are approving shares')
  const shares = await state.dexPoolContractService.getShares(state)
  const totalSupply = await state.dexPoolContractService.totalSupply(state)
  const sharesInPercent = (shares / totalSupply) * 100

  const stakingAmountCalculated =
    (shares / sharesInPercent) * state.position.amount

  const transactionApproval =
    await state.dexPoolContractService.approvePositionAmount({
      amount: stakingAmountCalculated,
      address: state.pool?.address
    })

  setIsLoading('Approving Transaction')
  await processTransaction(transactionApproval)

  setIsLoading('We are staking shares')
  const transaction = await state.stakePoolContractService.stakeToken({
    amount: stakingAmountCalculated,
    duration: state.position.duration,
    address: state.pool?.address
  })

  setIsLoading('We are processing your receipt')

  return processTransaction(transaction).then(({ transactionHash }) => ({
    ...state,
    transactionHash
  }))
}
