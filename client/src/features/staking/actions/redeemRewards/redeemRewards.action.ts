import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
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
import { setIsLoading } from '@/features/ui/loading.state'
import {
  ClaimRewardsCommand,
  claimRewardsCommand
} from './redeemRewards.command'
import {
  StoreRedeemRewardsCommand,
  storeRedeemRewardsCommand
} from './storeRedeemRewards.command'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { Pool } from '@/common/types/Pool'

export const redeemRewards = async ({ tokenA, tokenB }: TokenPair) => {
  const cStack = createCommandStack<
    ClaimRewardsCommand &
      StoreRedeemRewardsCommand &
      GetAccountCommand &
      GetStoredPoolCommand
  >({
    tokenA,
    tokenB,
    stakePoolContractService,
    poolFactoryContractService,
    account: {} as User,
    transactionHash: '',
    pool: {} as Pool
  })

  await cStack
    .add(getStoredPoolCommand)
    .add(getAccountCommand)
    .add(claimRewardsCommand)
    .add(storeRedeemRewardsCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
