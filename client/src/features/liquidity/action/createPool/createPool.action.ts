import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '../../../ui/loading.state'
import {
  AddLiquidityCommand,
  addLiquidityCommand
} from '../addLiquidity/addLiquidity.command'
import {
  StoreLiquidityCommand,
  storeLiquidityCommand
} from '../addLiquidity/storeLiquidity.command'
import { CreatePoolCommand, createPoolCommand } from './createPool.command'
import { StorePoolCommand, storePoolCommand } from './storePool.command'
import {
  GetAccountCommand,
  getAccountCommand
} from '@/features/common/commands/getAccount.command'
import {
  GetPoolAddressCommand,
  getPoolAddressCommand
} from '@/features/common/commands/getPoolAddress.command'

export type CreatePoolAction = AddLiquidityCommand &
  GetAccountCommand &
  GetPoolAddressCommand &
  CreatePoolCommand &
  StoreLiquidityCommand &
  StorePoolCommand
export const createPoolAction = async ({ tokenA, tokenB }: TokenPair) => {
  const cStack = createCommandStack<CreatePoolAction>({
    tokenA,
    tokenB,
    poolFactoryContractService,
    routerContractService,
    account: {} as User,
    transactionHash: '',
    poolAddress: ''
  })

  await cStack
    .add(getAccountCommand)
    .add(getPoolAddressCommand)
    .add(createPoolCommand)
    .add(storePoolCommand)
    .add(addLiquidityCommand)
    .add(storeLiquidityCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
