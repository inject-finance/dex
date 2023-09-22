import constants from '@/common/configuration/constants'
import { tokenService } from '@/common/services/token/Token.service'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { authenticate } from '../actions/authenticate.action'
import { connect } from '../actions/connect.action'
import { authState, setAuthState } from '../auth.state'
import { metamaskService } from '../services/metamask-service/MetamaskService'
import { rejectWhenMetamaskIsNotInstalled } from '../utils/rejectMetamaskRequest'

export const useMetamask = () => {
  const { account } = useRecoilValue(authState)

  useEffect(() => {
    const initialize = async () => {
      const token = tokenService.getToken()
      if (typeof window === 'undefined' || !window.ethereum?.isMetaMask)
        throw rejectWhenMetamaskIsNotInstalled()

      const isUnlocked = await window.ethereum._metamask.isUnlocked()

      if (token && isUnlocked) {
        await connect().catch()
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    const provider = metamaskService.getProvider()
    if (!provider) return

    provider?.on('network', (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload()
      }

      setAuthState({ network: newNetwork.name })
    })

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (!accounts.length) {
        window.location.reload()
        localStorage.removeItem(constants.tokenKey)
      }
      if (accounts.length && Array.isArray(accounts)) {
        await authenticate(accounts[0])
        localStorage.removeItem(constants.tokenKey)
      }
    })
  }, [account])
}
