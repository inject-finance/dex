import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { IDexPoolContractService } from '@/contracts/services/dexPool/IDexPoolContractService'
import { IRouterContractService } from '@/contracts/services/router/IRouterContractService'
import { rejectMetamaskRequest } from '@/features/auth/utils/rejectMetamaskRequest'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '../../../ui/loading.state'

export type RemoveLiquidityCommand = TokenPair & {
  poolAddress?: string
  dexPoolContractService: IDexPoolContractService
  shares: number
  account: User
  routerContractService: IRouterContractService
  transactionHash?: string
}
export const removeLiquidityCommand: Command<RemoveLiquidityCommand> = async (
  state
) => {
  if (!state.poolAddress)
    throw new ValidationError('Token pair does not exist!')
  if (!state.tokenA.address)
    throw new ValidationError('Token A address required')
  if (!state.tokenB.address)
    throw new ValidationError('Token B address required')

  await state.dexPoolContractService.init(state.poolAddress)

  setIsLoading('We are approving your shares')
  const approvalTransaction = await state.dexPoolContractService.approveAmount(
    state.shares
  )

  await processTransaction(approvalTransaction)

  setIsLoading('We are removing liquidity')
  const transaction = await state.routerContractService
    .removeLiquidity(state.tokenA, state.tokenB, state.account, state.shares)
    .catch((e) => rejectMetamaskRequest(e))

  const { transactionHash } = await processTransaction(transaction)

  return { ...state, transactionHash }
}
