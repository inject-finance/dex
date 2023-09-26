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
  GetPoolAddressCommand,
  getPoolAddressCommand
} from '@/features/common/commands/getPoolAddress.command'
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
}

export const removeLiquidity = async ({ tokenA, tokenB, shares }: Props) => {
  const cStack = createCommandStack<
    RemoveLiquidityCommand &
      StoreRemoveLiquidityCommand &
      GetAccountCommand &
      GetPoolAddressCommand
  >({
    tokenA,
    tokenB,
    shares,
    account: {} as User,
    routerContractService,
    dexPoolContractService,
    poolFactoryContractService,
    poolAddress: ''
  })

  await cStack
    .add(getAccountCommand)
    .add(getPoolAddressCommand)
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
