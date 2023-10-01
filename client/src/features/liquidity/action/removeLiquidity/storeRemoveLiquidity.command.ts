import { tokenService } from '@/common/services/token/Token.service'
import { Pool } from '@/common/types/Pool'
import { User } from '@/common/types/User'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { setIsLoading } from '../../../ui/loading.state'

export type StoreRemoveLiquidityCommand = {
  account: User
  pool: Pool
}

export const storeRemoveLiquidityCommand: Command<
  StoreRemoveLiquidityCommand
> = async (state) => {
  if (!state.account.id)
    throw new ValidationError(CommandsError.USER_ID_REQUIRED)
  if (!state.pool?.id) throw new ValidationError(CommandsError.POOL_ID_REQUIRED)

  setIsLoading('We are saving your entry')

  await fetch(`/api/users/${state.account.id}/liquidity/${state.pool.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenService.getToken()}`
    }
  })

  return state
}
