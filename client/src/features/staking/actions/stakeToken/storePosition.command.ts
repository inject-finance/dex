import { Pool } from '@/common/types/Pool'
import { PositionDurationAndAmount } from '@/common/types/Position'
import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { setIsLoading } from '@/features/ui/loading.state'
import dayjs from 'dayjs'

export type StorePositionCommand = {
  account: User
  position: PositionDurationAndAmount
  pool: Pool
} & TokenPair
export const storePositionCommand: Command<StorePositionCommand> = async (
  state
) => {
  if (!state.pool?.address)
    throw new ValidationError(CommandsError.POOL_ADDRESS_REQUIRED)
  if (!state.account.id)
    throw new ValidationError(CommandsError.ACCOUNT_ID_REQUIRED)
  if (!state.tokenA.address)
    throw new ValidationError(CommandsError.TOKEN_A_ADDRESS_REQUIRED)
  if (!state.tokenB.address)
    throw new ValidationError(CommandsError.TOKEN_B_ADDRESS_REQUIRED)

  setIsLoading('We are saving your position')

  await fetch(`/api/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: state.account.id,
      poolId: state.pool?.id,
      start: dayjs().format('YYYY-MM-DD HH:mm:ss.SSSSSZ'),
      end: dayjs()
        .add(state.position.duration, 'days')
        .format('YYYY-MM-DD HH:mm:ss.SSSSSZ')
    })
  }).then((res) => res.json())

  return state
}
