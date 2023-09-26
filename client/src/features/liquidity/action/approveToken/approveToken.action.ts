import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import {
  ApproveTokenCommand,
  approveTokenCommand
} from '@/features/common/commands/approve-tokens/approve.token.command'
import { createCommandStack } from '@/features/common/process/create-command.stack'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import Swal from 'sweetalert2'
import { setIsLoading } from '../../../ui/loading.state'
import { getRecoil } from 'recoil-nexus'
import { uiState } from '@/features/ui/ui.state'

export const approveToken = async ({
  token,
  owner
}: {
  token: Token
  owner: User
}) => {
  const { showNetworkNotice } = getRecoil(uiState)
  const cStack = createCommandStack<ApproveTokenCommand>({
    token,
    tokenContractService,
    dexPoolContractService,
    account: owner,
    transactionHash: ''
  })

  await cStack
    .add(approveTokenCommand)
    .run()
    .then(({ transactionHash, token }) => {
      Swal.fire({
        title: 'Transaction details',
        text: 'Operation executed successfully',
        icon: 'success',
        iconColor: '#339EA8',
        color: '#f2f2f2',
        background: '#192026',
        showConfirmButton: false,
        html: `
          <div>
            ${token.symbol}
            <br /> 
            Approved: ${formatQuantity(token.amount)}
            <br /> 
            ${
              transactionHash &&
              `Transaction Hash: 
                <a clasName="text-[#fdd981]" href="https://${
                  showNetworkNotice ? 'goerli.' : ''
                }arbiscan.io/tx/${transactionHash}" target="__blank" style="color: green;">
                  ${transactionHash}
                </a>
              `
            }
          </div>
        `
      })
    })
    .finally(() => setIsLoading())
}
