import { TokenPair } from '@/common/types/Token'
import { IPoolFactoryContractService } from '@/contracts/services/factory/IPoolFactoryContractService'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { setIsLoading } from '../../../ui/loading.state'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

export type StorePoolCommand = TokenPair & {
  poolFactoryContractService: IPoolFactoryContractService
}
export const storePoolCommand: Command<StorePoolCommand> = async (state) => {
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  setIsLoading('We are saving your pair')

  const address = await state.poolFactoryContractService.getPairAddress(
    state.tokenA.address,
    state.tokenB.address
  )

  const resTokenA = await fetch(
    `/api/tokens/filter-one?property=symbol&value=${String(
      state.tokenA.symbol
    )}`
  )
  const tokenA = await resTokenA.json()

  const resTokenB = await fetch(
    `/api/tokens/filter-one?property=symbol&value=${String(
      state.tokenB.symbol
    )}`
  )
  const tokenB = await resTokenB.json()

  const res = await fetch(`/api/pools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      tokenAId: tokenA.id,
      tokenBId: tokenB.id
    })
  })

  await res.json()

  return state
}
