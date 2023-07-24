import { injectTokenContractService } from '@/contracts/services/inject/InjectTokenContractService'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type SetStakingCommand = {
  poolAddress?: string
  initialDeposit: number
  minStakeAmount: number
  interestRate: number
  minReserve: number
  transactionHash?: string
  stakePoolContractService: IStakePoolContractService
}
export const setStakingCommand: Command<SetStakingCommand> = async (state) => {
  if (!state.poolAddress)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (state.initialDeposit < 10)
    throw new ValidationError('Minimal initial deposit is 10')
  if (state.interestRate < 2)
    throw new ValidationError('Minimal interestRate 2%')
  if (state.interestRate > 2)
    throw new ValidationError('Maximum interestRate 10%')
  if (state.minStakeAmount < 0)
    throw new ValidationError('Minimal Stake Amount is required')
  if (state.minReserve < 0)
    throw new ValidationError('Minimal min reserve is 0')

  // Step: 1 = Approve
  setIsLoading('We are approving initial deposit')
  const transactionApproval =
    await injectTokenContractService.approveStakingContract(
      state.initialDeposit
    )

  setIsLoading('We are processing approbation')
  await processTransaction(transactionApproval)

  // Step: 2
  setIsLoading('We are setting stakeable pool')
  const transaction = await state.stakePoolContractService.setStakingPool({
    initialDeposit: state.initialDeposit,
    interestRate: state.interestRate,
    minReserve: state.minReserve,
    minStakeAmount: state.minStakeAmount,
    poolAddress: state.poolAddress
  })

  setIsLoading('We are processing receipt')

  if (!transaction)
    throw new ValidationError(CommandsError.TRANSACTION_NOT_FOUND)

  const contractReceipt = await transaction?.wait()
  if (!contractReceipt)
    throw new Error(CommandsError.CONTRACT_RECEIPT_UNSUCCESSFUL)

  state.transactionHash = contractReceipt.transactionHash

  return state
}
