import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import {
  GetStoredPoolCommand,
  getStoredPoolCommand
} from '@/features/common/commands/getStoredPoolCommand.command'
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
import {
  GetAccountCommand,
  getAccountCommand
} from '@/features/common/commands/getAccount.command'
import { Pool } from '@/common/types/Pool'

type Props = TokenPair

type AddLiquidityAction = AddLiquidityCommand &
  StoreLiquidityCommand &
  GetStoredPoolCommand &
  GetAccountCommand
export const addLiquidityAction = async ({ tokenA, tokenB }: Props) => {
  const cStack = createCommandStack<AddLiquidityAction>({
    tokenA,
    tokenB,
    routerContractService,
    poolFactoryContractService,
    account: {} as User,
    transactionHash: '',
    pool: {} as Pool
  })

  await cStack
    .add(getAccountCommand)
    .add(getStoredPoolCommand)
    .add(addLiquidityCommand)
    .add(storeLiquidityCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
