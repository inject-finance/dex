import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { IDexPoolContractService } from '@/contracts/services/dexPool/IDexPoolContractService'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'

export type GetSharesCommand = TokenPair & {
  poolAddress?: string
  dexPoolContractService: IDexPoolContractService
  account: User
  shares: number
  sharesInPercent: number
}
export const getSharesCommand: Command<GetSharesCommand> = async (state) => {
  if (!state.poolAddress)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  const shares = await state.dexPoolContractService.getShares(state)
  const totalSupply = await state.dexPoolContractService.totalSupply(state)

  state.shares = shares
  state.sharesInPercent = totalSupply ? (shares / totalSupply) * 100 : 0

  return state
}
