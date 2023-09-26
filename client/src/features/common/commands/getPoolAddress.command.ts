import { TokenPair } from '@/common/types/Token'
import { IPoolFactoryContractService } from '@/contracts/services/factory/IPoolFactoryContractService'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { CommandsError } from '../enums/CommandsError.enum'

export type GetPoolAddressCommand = TokenPair & {
  poolFactoryContractService: IPoolFactoryContractService
  poolAddress?: string
}

export const getPoolAddressCommand: Command<GetPoolAddressCommand> = async (
  state
) => {
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  state.poolAddress = await state.poolFactoryContractService.getPoolAddress(
    state.tokenA.address,
    state.tokenB.address
  )

  return state
}
