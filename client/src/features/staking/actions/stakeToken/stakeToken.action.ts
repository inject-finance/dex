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

export const stakeToken = async ({
  tokenA,
  tokenB,
  stakeDuration,
  sharesToStaking,
  poolAddress,
  account
}: TokenPair & {
  stakeDuration: number
  sharesToStaking: number
  poolAddress?: string
  account: User
}) => {
  const cStack = createCommandStack<StakeTokenCommand & StorePositionCommand>({
    tokenA,
    tokenB,
    stakeDuration,
    sharesToStaking,
    stakePoolContractService,
    poolAddress,
    account
  })

  await cStack
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
