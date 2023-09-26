import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '@/features/ui/loading.state'
import { StakeTokenCommand, stakeTokenCommand } from './stakeToken.command'
import {
  StorePositionCommand,
  storePositionCommand
} from './storePosition.command'
import {
  GetAccountCommand,
  getAccountCommand
} from '@/features/common/commands/getAccount.command'
import {
  GetPoolAddressCommand,
  getPoolAddressCommand
} from '@/features/common/commands/getPoolAddress.command'
import {
  CheckStakingPoolAvailabilityCommand,
  checkStakingPoolAvailabilityCommand
} from './checkStakingPoolAvailability.command'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'

type StakeTokenAction = GetAccountCommand &
  StakeTokenCommand &
  StorePositionCommand
export const stakeToken = async ({
  tokenA,
  tokenB,
  stakeDuration,
  sharesToStake
}: TokenPair & {
  stakeDuration: number
  sharesToStake: number
}) => {
  const cStack = createCommandStack<
    GetAccountCommand &
      GetPoolAddressCommand &
      StakeTokenAction &
      CheckStakingPoolAvailabilityCommand
  >({
    tokenA,
    tokenB,
    stakeDuration,
    sharesToStake,
    stakePoolContractService,
    poolFactoryContractService,
    dexPoolContractService,
    account: {} as User,
    poolAddress: '',
    transactionHash: ''
  })

  await cStack
    .add(getAccountCommand)
    .add(getPoolAddressCommand)
    .add(checkStakingPoolAvailabilityCommand)
    .add(stakeTokenCommand)
    .add(storePositionCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => {
      setIsLoading()
    })
}
