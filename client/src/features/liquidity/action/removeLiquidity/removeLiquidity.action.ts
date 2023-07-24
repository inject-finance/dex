import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '../../../ui/loading.state'
import {
  RemoveLiquidityCommand,
  removeLiquidityCommand
} from './removeLiquidity.command '
import {
  StoreRemoveLiquidityCommand,
  storeRemoveLiquidityCommand
} from './storeRemoveLiquidity.command'

type Props = TokenPair & {
  shares: number
  account: User
  poolAddress?: string
}

export const removeLiquidity = async ({
  tokenA,
  tokenB,
  shares,
  account,
  poolAddress
}: Props) => {
  const cStack = createCommandStack<
    RemoveLiquidityCommand & StoreRemoveLiquidityCommand
  >({
    tokenA,
    tokenB,
    shares,
    account,
    routerContractService,
    dexPoolContractService,
    poolAddress
  })

  await cStack
    .add(removeLiquidityCommand)
    .add(storeRemoveLiquidityCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => {
      setIsLoading()
    })
}
