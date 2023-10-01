import { Pool } from '@/common/types/Pool'
import { User } from '@/common/types/User'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { setIsLoading } from '@/features/ui/loading.state'

export type StoreRedeemRewardsCommand = {
  pool: Pool
  account: User
}
export const storeRedeemRewardsCommand: Command<
  StoreRedeemRewardsCommand
> = async (state) => {
  if (!state.pool?.id) throw new ValidationError(CommandsError.POOL_ID_REQUIRED)
  if (!state.account.id)
    throw new ValidationError(CommandsError.ACCOUNT_ID_REQUIRED)

  setIsLoading('We are redeeming position')

  await fetch(`/api/positions/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: state.account.id,
      poolId: state.pool.id
    })
  })

  return state
}
