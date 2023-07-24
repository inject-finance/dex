import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '../../../ui/loading.state'
import {
  AddLiquidityCommand,
  addLiquidityCommand
} from './addLiquidity.command'
import {
  StoreLiquidityCommand,
  storeLiquidityCommand
} from './storeLiquidity.command'

type Props = TokenPair & {
  account: User
  poolAddress?: string
}

type AddLiquidityAction = AddLiquidityCommand & StoreLiquidityCommand
export const addLiquidity = async ({
  tokenA,
  tokenB,
  account,
  poolAddress
}: Props) => {
  const cStack = createCommandStack<AddLiquidityAction>({
    tokenA,
    tokenB,
    account,
    routerContractService,
    poolAddress,
    transactionHash: ''
  })

  await cStack
    .add(addLiquidityCommand)
    .add(storeLiquidityCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => setIsLoading())
}
