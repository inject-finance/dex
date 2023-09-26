import { TokenPair } from '@/common/types/Token'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '@/features/ui/loading.state'
import {
  SetStakingCommand,
  setStakingCommand
} from './setAsStakeablePool.command'
import { getPoolAddressCommand } from '@/features/common/commands/getPoolAddress.command'

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
    poolAddress: ''
  })

  await cStack
    .add(getPoolAddressCommand)
    .add(setStakingCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => {
      setIsLoading()
    })
}
