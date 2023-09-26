import { type Token } from '@/common/types/Token'
import { tokenContractService } from '@/contracts/services/token/TokenContractService'
import { selectorFamily } from 'recoil'

export const getBalanceSelector = selectorFamily({
  key: 'getBalanceSelector',
  get: (token: Token) => () => tokenContractService.getBalance(token)
})
