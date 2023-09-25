import {
  type BaseContract,
  type ContractInterface,
  ethers,
  Contract
} from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

export const createAsyncContract = async <T extends BaseContract>(
  contractAddress: string,
  contractAbi: ContractInterface
): Promise<T | null> => {
  const provider = await detectEthereumProvider()
  if (!provider) {
    return null
  }

  const ethersProvider = new ethers.providers.Web3Provider(provider)
  const signer = ethersProvider.getSigner()

  try {
    await signer.getAddress()
    return new Contract(contractAddress, contractAbi, signer) as T
  } catch (error) {
    return new Contract(contractAddress, contractAbi, ethersProvider) as T
  }
}
