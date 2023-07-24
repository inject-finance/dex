import { JsonRpcErrorCode } from '@/common/exceptions/json-rpc-error'
import Swal from 'sweetalert2'
import { setIsLoadingAuth } from '../auth.state'
import { ProviderRpcError } from '../types/metamask-types'

export const rejectWhenMetamaskIsNotInstalled = () => {
  Swal.fire({
    background: '#192026',
    title: 'Metamask',
    icon: 'warning',
    iconColor: '#FDD981',
    text: 'Inject Finance can only be accessed when Metamask has been installed.',
    color: '#f2f2f2',
    showConfirmButton: false
  })
}

export const rejectMetamaskRequest = (err: unknown) => {
  const error = err as ProviderRpcError

  if (error.code === JsonRpcErrorCode.ALREADY_PROCESSING) {
    Swal.fire({
      title: 'Metamask',
      icon: 'warning',
      iconColor: '#FDD981',
      text: `You must approve the transaction in order to continue. ${error.message}`,
      color: '#f2f2f2',
      background: '#192026',
      showConfirmButton: false
    })
  }

  if (String(error.code) === JsonRpcErrorCode.ACTION_REJECTED) {
    Swal.fire({
      background: '#192026',
      title: 'Metamask',
      icon: 'warning',
      iconColor: '#FDD981',
      text: `You must approve the transaction in order to continue.`,
      color: '#f2f2f2',
      showConfirmButton: false
    })
  }

  if (error.reason === JsonRpcErrorCode.INSUFFICIENT_OUTPUT_AMOUNT) {
    Swal.fire({
      background: '#192026',
      title: 'Metamask',
      icon: 'warning',
      iconColor: '#FDD981',
      text: `The Out Quantity is not enough to complete the exchange.`,
      color: '#f2f2f2',
      showConfirmButton: false
    })
  }

  if (
    error.data?.message.includes(JsonRpcErrorCode.INSUFFICIENT_FUNDS_FOR_GAS)
  ) {
    Swal.fire({
      background: '#192026',
      title: 'Metamask',
      icon: 'warning',
      iconColor: '#FDD981',
      text: 'Insufficient funds to pay for gas and make the swap',
      color: '#f2f2f2',
      showConfirmButton: false
    })
  }

  // "err: insufficient funds for gas * price + value: address 0x1D5B8a1a9eC3a6608F280520a67e8cB7a14600ba have 97319416003627127 want 97319416003627130 (supplied gas 25472962)"

  setIsLoadingAuth(false)
  throw err
}
