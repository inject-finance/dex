import { User } from '@/common/types/User'
import { authState } from '@/features/auth/auth.state'
import { type Command } from '@/features/common/process/command'
import { getRecoilPromise } from 'recoil-nexus'

export type GetAccountCommand = {
  account: User
}
export const getAccountCommand: Command<GetAccountCommand> = async (state) => {
  state.account = (await getRecoilPromise(authState))?.account
  return state
}
