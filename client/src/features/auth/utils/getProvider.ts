import { ethers } from 'ethers'

export const getProvider = (): ethers.providers.JsonRpcProvider | null => {
  if (typeof window === 'undefined') return null

  if (!window.ethereum?.isMetaMask) return null

  return new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider
  )
}
