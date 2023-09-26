import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { IPoolFactoryContractService } from '@/contracts/services/factory/IPoolFactoryContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type CreatePoolCommand = {
  poolAddress?: string
  account: User
  poolFactoryContractService: IPoolFactoryContractService
  transactionHash: string
} & TokenPair
export const createPoolCommand: Command<CreatePoolCommand> = async (state) => {
  if (state.poolAddress)
    throw new ValidationError(CommandsError.TOKEN_PAIR_ALREADY_EXIST)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)
  if (!state.account.address)
    throw new ValidationError(CommandsError.METAMASK_ADDRESS_REQUIRED)

  setIsLoading(
    `We are creating your pool ${state.tokenA.symbol} - ${state.tokenB.symbol}`
  )

  const transaction = await state.poolFactoryContractService?.createPair(
    state.tokenA.address,
    state.tokenB.address
  )

  setIsLoading('We are processing your transaction')
  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
