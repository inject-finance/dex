import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
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

export const redeemRewards = async ({ tokenA, tokenB }: TokenPair) => {
  const cStack = createCommandStack<
    ClaimRewardsCommand &
      StoreRedeemRewardsCommand &
      GetAccountCommand &
      GetPoolAddressCommand
  >({
    tokenA,
    tokenB,
    stakePoolContractService,
    poolFactoryContractService,
    account: {} as User,
    poolAddress: '',
    transactionHash: ''
  })

  await cStack
    .add(getPoolAddressCommand)
    .add(getAccountCommand)
    .add(claimRewardsCommand)
    .add(storeRedeemRewardsCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
