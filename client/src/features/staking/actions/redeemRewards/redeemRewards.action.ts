import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
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

export const redeemRewards = async ({
  tokenA,
  tokenB,
  account,
  poolAddress
}: TokenPair & { account: User; poolAddress?: string }) => {
  const cStack = createCommandStack<
    ClaimRewardsCommand & StoreRedeemRewardsCommand
  >({
    tokenA,
    tokenB,
    account,
    poolAddress,
    stakePoolContractService
  })

  await cStack
    .add(claimRewardsCommand)
    .add(storeRedeemRewardsCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => {
      setIsLoading()
    })
}
