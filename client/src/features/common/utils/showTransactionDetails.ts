import { Token, TokenPair } from '@/common/types/Token'
import Swal from 'sweetalert2'
import { formatQuantity } from './formatQuantity'
import { getRecoil } from 'recoil-nexus'
import { uiState } from '@/features/ui/ui.state'

type TransactionDetails = Partial<TokenPair> & {
  token?: Token
  transactionHash?: string
}

export const showTransactionDetails = ({
  token,
  tokenA,
  tokenB,
  transactionHash
}: TransactionDetails): void => {
  const { showNetworkNotice } = getRecoil(uiState)
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
        ${token?.symbol || ''}
        ${tokenA?.symbol} / ${tokenB?.symbol}
        ${
          tokenA?.amount
            ? `
            <br />
            ${tokenA?.symbol}:${formatQuantity(tokenA?.amount)}
            `
            : ''
        }
        ${
          tokenB?.amount
            ? `
            <br /> 
            ${tokenB?.symbol}:${formatQuantity(tokenB?.amount)}
            `
            : ''
        }
        <br /> 
        ${
          transactionHash
            ? `Transaction Hash: 
            <a clasName="text-[#fdd981]" href="https://${
              showNetworkNotice ? 'goerli' : ''
            }.arbiscan.io/tx/${transactionHash}" target="__blank" style="color: green;">
              ${transactionHash}
            </a>
          `
            : ''
        }
      </div>
    `
  })
}
