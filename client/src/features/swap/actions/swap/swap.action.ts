import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { Slippage } from '@/common/types/types'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import {
  ApproveTokenCommand,
  approveTokenCommand
} from '@/features/common/commands/approve-tokens/approve.token.command'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '@/features/ui/loading.state'
import { SwapCommand, swapCommand } from './swap.command'

type SwapAction = ApproveTokenCommand & SwapCommand

type Props = TokenPair & { account: User; slippage: Slippage }

export const swapAction = async ({
  tokenA,
  tokenB,
  account,
  slippage
}: Props) => {
  const cStack = createCommandStack<SwapAction>({
    token: tokenA,
    tokenA,
    tokenB,
    account,
    slippage,
    transactionHash: '',
    tokenContractService,
    routerContractService,
    dexPoolContractService
  })

  await cStack
    .add(approveTokenCommand)
    .add(swapCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => setIsLoading())
}
