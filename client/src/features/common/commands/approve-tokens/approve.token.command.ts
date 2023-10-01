import { Token } from '@/common/types/Token'
import { UserAddress } from '@/common/types/User'
import { IDexPoolContractService } from '@/contracts/services/dexPool/IDexPoolContractService'
import { ITokenContractService } from '@/contracts/services/token/ITokenContractService'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { type Command } from '@/features/common/process/command'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { setIsLoading } from '@/features/ui/loading.state'

export type ApproveTokenCommand = {
  token: Token
  dexPoolContractService: IDexPoolContractService
  tokenContractService: ITokenContractService
  account: UserAddress
  transactionHash: string
}
export const approveTokenCommand: Command<ApproveTokenCommand> = async (
  state
) => {
  if (!state.token.amount) throw new ValidationError('Amount required')
  if (!state.token.address) throw new ValidationError('Token address required')
  if (!state.account.address)
    throw new ValidationError('Metamask address required')
  if (state.token.symbol === 'ETH') {
    return { ...state }
  }
  setIsLoading(`We are approving ${state.token.symbol} token`)

  await state.dexPoolContractService.init(String(state.token.address))

  const allowance = await state.dexPoolContractService.getAllowance(
    state.account
  )

  if (Number(state.token.amount) > Number(allowance)) {
    const transaction = await state.tokenContractService.approve(state.token)
    if (!transaction) return state

    setIsLoading(`We are processing ${state.token.symbol} token`)
    const { transactionHash } = await processTransaction(transaction)

    state.transactionHash = transactionHash
  }

  return state
}
