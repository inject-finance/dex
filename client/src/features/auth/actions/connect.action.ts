import { MetamaskError } from '@/features/common/errors/MetamaskIsNotInstalledError'
import { setIsLoadingAuth } from '../auth.state'
import { metamaskService } from '../services/metamask-service/MetamaskService'
import {
  rejectMetamaskRequest,
  rejectWhenMetamaskIsNotInstalled
} from '../utils/rejectMetamaskRequest'
import { authenticate } from './authenticate.action'

export const connect = async () => {
  try {
    setIsLoadingAuth(true)
    const provider = metamaskService.getProvider()
    if (!provider) {
      throw rejectWhenMetamaskIsNotInstalled()
    }

    const [address] = await provider.send('eth_requestAccounts', [])
    await authenticate(address)
    return address
  } catch (error) {
    if (error instanceof MetamaskError) {
      rejectWhenMetamaskIsNotInstalled()
    } else {
      rejectMetamaskRequest(error)
    }
    return undefined
  } finally {
    setIsLoadingAuth(false)
  }
}
