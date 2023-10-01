import { TokenPair } from '@/common/types/Token'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '@/features/ui/loading.state'
import {
  SetStakingCommand,
  setStakingCommand
} from './setAsStakeablePool.command'
import { getStoredPoolCommand } from '@/features/common/commands/getStoredPoolCommand.command'
import { Pool } from '@/common/types/Pool'

interface Props extends TokenPair {
  initialDeposit: number
  minStakeAmount: number
  interestRate: number
  minReserve: number
}

export const setAsStakeable = async ({
  initialDeposit,
  minStakeAmount,
  interestRate,
  minReserve
}: Props) => {
  const cStack = createCommandStack<SetStakingCommand>({
    minStakeAmount,
    initialDeposit,
    interestRate,
    minReserve,
    stakePoolContractService,
    pool: {} as Pool
  })

  await cStack
    .add(getStoredPoolCommand)
    .add(setStakingCommand)
    .run()
    .then((state) => showTransactionDetails(state))
    .finally(() => setIsLoading())
}
