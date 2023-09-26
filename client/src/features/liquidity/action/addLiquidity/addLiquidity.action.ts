import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import {
  GetPoolAddressCommand,
  getPoolAddressCommand
} from '@/features/common/commands/getPoolAddress.command'
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

type Props = TokenPair

type AddLiquidityAction = AddLiquidityCommand &
  StoreLiquidityCommand &
  GetPoolAddressCommand &
  GetAccountCommand
export const addLiquidityAction = async ({ tokenA, tokenB }: Props) => {
  const cStack = createCommandStack<AddLiquidityAction>({
    tokenA,
    tokenB,
    routerContractService,
    poolFactoryContractService,
    account: {} as User,
    poolAddress: '',
    transactionHash: ''
  })

  await cStack
    .add(getAccountCommand)
    .add(getPoolAddressCommand)
    .add(addLiquidityCommand)
    .add(storeLiquidityCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
