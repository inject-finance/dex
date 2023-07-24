import {
  type BaseContract,
  type ContractInterface,
  ethers,
  Contract
} from 'ethers'

export const createAsyncContract = async <T extends BaseContract>(
  contractAddress: string,
  contractAbi: ContractInterface
) => {
  if (typeof window === 'undefined') return null

  if (!window.ethereum?.isMetaMask) return null

  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider
  )

  const signer = provider.getSigner()

  try {
    await signer.getAddress()
    return new Contract(contractAddress, contractAbi, signer) as T
  } catch (ex) {
    return new Contract(contractAddress, contractAbi, provider) as T
  }
}
