import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { showTransactionDetails } from '@/features/common/utils/showTransactionDetails'
import { setIsLoading } from '@/features/ui/loading.state'
import { SetStakingCommand, setStakingCommand } from './setStaking.command'

type Props = {
  initialDeposit: number
  minStakeAmount: number
  interestRate: number
  minReserve: number
  poolAddress?: string
}

export const setStakingPool = async ({
  initialDeposit,
  minStakeAmount,
  interestRate,
  minReserve,
  poolAddress
}: Props) => {
  const cStack = createCommandStack<SetStakingCommand>({
    minStakeAmount,
    initialDeposit,
    interestRate,
    minReserve,
    stakePoolContractService,
    poolAddress
  })

  await cStack
    .add(setStakingCommand)
    .run()
    .then((state) => {
      showTransactionDetails(state)
    })
    .finally(() => {
      setIsLoading()
    })
}
