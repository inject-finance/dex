import { type Token } from '@/common/types/Token'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import { metamaskService } from '@/features/auth/services/metamask-service/MetamaskService'
import { selectorFamily } from 'recoil'
import { authState } from '../../auth/auth.state'

export const getBalanceSelector = selectorFamily({
  key: 'getBalanceSelector',
  get:
    (token: Token) =>
    ({ get }) => {
      const { account, isAuthenticated } = get(authState)

      if (!isAuthenticated) {
        return 0
      }
      if (token.symbol === 'ETH') {
        return metamaskService.getBalance()
      }
      return tokenContractService.getBalance(token, account.address)
    }
})
