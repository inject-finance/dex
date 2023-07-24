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
  }

  getProvider(): ethers.providers.JsonRpcProvider | null {
    if (typeof window === 'undefined') return null

    if (!window.ethereum?.isMetaMask) return null

    return new ethers.providers.Web3Provider(
      window.ethereum as ethers.providers.ExternalProvider
    )
  }
}

export const metamaskService = new MetamaskService()
