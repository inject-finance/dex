import { TokenPair } from '@/common/types/Token'
import { IPoolFactoryContractService } from '@/contracts/services/factory/IPoolFactoryContractService'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { CommandsError } from '../enums/CommandsError.enum'
import { Pool } from '@/common/types/Pool'

export type GetStoredPoolCommand = TokenPair & {
  poolFactoryContractService: IPoolFactoryContractService
  pool: Pool
}
export const getStoredPoolCommand: Command<GetStoredPoolCommand> = async (
  state
) => {
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  const address = await state.poolFactoryContractService.getPoolAddress(
    state.tokenA.address,
    state.tokenB.address
  )

  const pool: Pool = await fetch(
    `/api/pools/criteria?key=address&value=${address}`
  ).then((res) => res.json())

  return { ...state, pool }
}
