import { TokenPair } from '@/common/types/Token'
import { IRouterContractService } from '@/contracts/services/router/IRouterContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type SwapCommand = TokenPair & {
  slippage: number
  routerContractService: IRouterContractService
  transactionHash: string
}

export const swapCommand: Command<SwapCommand> = async (state) => {
  if (!state.tokenA.amount)
    throw new ValidationError(CommandsError.TOKEN_A_AMOUNT_REQUIRED)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)
  if (!state.tokenB.amount)
    throw new ValidationError(CommandsError.TOKEN_B_AMOUNT_REQUIRED)
  if (Number(state.slippage) < 0)
    throw new ValidationError(CommandsError.SLIPPAGE_REQUIRED)
  if (Number(state.slippage) > 10)
    throw new ValidationError(CommandsError.SLIPPAGE_LIMITED_IN_10_PERCENT)

  setIsLoading('We are swapping')

  const transaction = await state.routerContractService.swap(
    state.tokenA,
    state.tokenB
  )

  setIsLoading('We are creating your receipt')

  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
