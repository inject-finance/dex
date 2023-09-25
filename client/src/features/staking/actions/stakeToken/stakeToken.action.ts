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

type StakeTokenAction = GetAccountCommand &
  StakeTokenCommand &
  StorePositionCommand
export const stakeToken = async ({
  tokenA,
  tokenB,
  stakeDuration,
  sharesToStaking,
  poolAddress
}: TokenPair & {
  stakeDuration: number
  sharesToStaking: number
  poolAddress?: string
}) => {
  const cStack = createCommandStack<StakeTokenAction>({
    tokenA,
    tokenB,
    stakeDuration,
    sharesToStaking,
    stakePoolContractService,
    poolAddress,
    account: {} as User
  })

  await cStack
    .add(getAccountCommand)
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
