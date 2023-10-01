import { PositionDurationAndAmount } from '@/common/types/Position'
import { TokenPair } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
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
  CheckStakingPoolAvailabilityCommand,
  checkStakingPoolAvailabilityCommand
} from './checkStakingPoolAvailability.command'
import { StakeTokenCommand, stakeTokenCommand } from './stakeToken.command'
import {
  StorePositionCommand,
  storePositionCommand
} from './storePosition.command'
import { Pool } from '@/common/types/Pool'

type StakeTokenAction = GetAccountCommand &
  StakeTokenCommand &
  StorePositionCommand
export const stakeToken = async ({
  position,
  tokenA,
  tokenB
}: {
  position: PositionDurationAndAmount
} & TokenPair) => {
  const cStack = createCommandStack<
    GetAccountCommand &
      GetStoredPoolCommand &
      StakeTokenAction &
      CheckStakingPoolAvailabilityCommand
  >({
    tokenA,
    tokenB,
    position,
    stakePoolContractService,
    poolFactoryContractService,
    dexPoolContractService,
    account: {} as User,
    transactionHash: '',
    pool: {} as Pool
  })

  await cStack
    .add(getAccountCommand)
    .add(getStoredPoolCommand)
    .add(checkStakingPoolAvailabilityCommand)
    .add(stakeTokenCommand)
    .add(storePositionCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
