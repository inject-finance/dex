import { ethers, utils } from 'ethers'
import type IAuthService from './IMetamaskService'

export default class MetamaskService implements IAuthService {
  getSignature(nonce: string): Promise<string> {
    const signer = this.getSigner()
    return signer.signMessage(nonce)
  }

  getSigner(): ethers.providers.JsonRpcSigner {
    const provider = this.getProvider()

    if (!provider)
      throw new Error('Please make sure you have metamask installed.')

    return provider.getSigner()
  }

  getBalance() {
    const signer = this.getSigner()
    return signer
      .getBalance()
      .then((balance) => Number(utils.formatEther(balance)))
      .catch(() => 0)
  }

  getProvider(): ethers.providers.JsonRpcProvider | null {
    if (typeof window === 'undefined' || !window.ethereum?.isMetaMask) {
      return null
    }

    return new ethers.providers.Web3Provider(window.ethereum)
  }

  getAccount(): Promise<string> {
    const provider = this.getProvider()

    if (!provider)
      throw new Error('Please make sure you have metamask installed.')

    return provider
      .listAccounts()
      .then((accounts) => accounts[0])
      .catch(() => '')
  }
}

export const metamaskService = new MetamaskService()
