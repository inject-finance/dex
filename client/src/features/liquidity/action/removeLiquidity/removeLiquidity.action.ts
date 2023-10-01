import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import {
  GetAccountCommand,
  getAccountCommand
} from '@/features/common/commands/getAccount.command'
import {
  GetStoredPoolCommand,
  getStoredPoolCommand
} from '@/features/common/commands/getStoredPoolCommand.command'
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
import { Pool } from '@/common/types/Pool'

type Props = TokenPair & {
  shares: number
}

export const removeLiquidity = async ({ tokenA, tokenB, shares }: Props) => {
  const cStack = createCommandStack<
    RemoveLiquidityCommand &
      StoreRemoveLiquidityCommand &
      GetAccountCommand &
      GetStoredPoolCommand
  >({
    tokenA,
    tokenB,
    shares,
    account: {} as User,
    routerContractService,
    dexPoolContractService,
    poolFactoryContractService,
    pool: {} as Pool
  })

  await cStack
    .add(getAccountCommand)
    .add(getStoredPoolCommand)
    .add(removeLiquidityCommand)
    .add(storeRemoveLiquidityCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
