import { TokenPair } from '@/common/types/Token'
import { IRouterContractService } from '@/contracts/services/router/IRouterContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '../../../ui/loading.state'

export type AddLiquidityCommand = TokenPair & {
  poolAddress?: string
  routerContractService: IRouterContractService
  transactionHash: string
}
export const addLiquidityCommand: Command<AddLiquidityCommand> = async (
  state
) => {
  if (!state.poolAddress?.length)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.tokenA.amount)
    throw new ValidationError(CommandsError.TOKEN_A_AMOUNT_REQUIRED)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  setIsLoading('We are Adding Liquidity')

  const transaction = await state.routerContractService.addLiquidity(
    state.tokenA,
    state.tokenB
  )

  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
