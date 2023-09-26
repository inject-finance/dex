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
  const tokenAStr = tokenA?.amount
    ? `${tokenA.symbol}:${formatQuantity(tokenA.amount)}`
    : ''
  const tokenBStr = tokenB?.amount
    ? `${tokenB.symbol}:${formatQuantity(tokenB.amount)}`
    : ''
  const transactionHashStr = transactionHash
    ? `Transaction Hash: <a class="text-[#fdd981]" href="https://${
        showNetworkNotice ? 'goerli.' : ''
      }arbiscan.io/tx/${transactionHash}" target="__blank" style="color: green;">${transactionHash}</a>`
    : ''

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
        <br />
        ${tokenAStr}
        <br />
        ${tokenBStr}
        <br />
        ${transactionHashStr}
      </div>
    `
  })
}
