import type Web3 from 'web3'
declare global {
  interface Window {
    ethereum?: Web3['ethereum']
    web3: Web3
  }
}
