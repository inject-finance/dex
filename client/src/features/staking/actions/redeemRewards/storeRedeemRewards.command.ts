import { Pool } from '@/common/types/Pool'
import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { setIsLoading } from '@/features/ui/loading.state'

export type StoreRedeemRewardsCommand = {
  poolAddress?: string
  account: User
} & TokenPair
export const storeRedeemRewardsCommand: Command<
  StoreRedeemRewardsCommand
> = async (state) => {
  if (!state.poolAddress)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.account.id)
    throw new ValidationError(CommandsError.ACCOUNT_ID_REQUIRED)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  setIsLoading('We are redeeming position')
  const pool: Pool = await fetch(
    `/api/pools/criteria?key=address&value=${state.poolAddress}`
  ).then((res) => res.json())

  await fetch(`/api/positions/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: state.account.id,
      poolId: pool.id
    })
  })

  return state
}
