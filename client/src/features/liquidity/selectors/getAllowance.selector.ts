import { Token } from '@/common/types/Token'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { selector, selectorFamily } from 'recoil'

export const getAllowanceSelector = selectorFamily({
  key: 'getAllowanceSelector',
  get:
    (token: Token) =>
    async ({ get }) => {
      const { account } = get(authState)
      await dexPoolContractService.init(String(token.address))
      return dexPoolContractService.getAllowance(account)
    }
})

export const getPairAllowanceSelector = selector({
  key: 'getAllowanceSelector',
  get: async ({ get }) => {
    const { account } = get(authState)
    const { tokenA, tokenB } = get(poolState)
    await dexPoolContractService.init(tokenA.address)
    const allowanceA = await dexPoolContractService.getAllowance(account)

    await dexPoolContractService.init(tokenB.address)
    const allowanceB = await dexPoolContractService.getAllowance(account)

    return { allowanceA, allowanceB }
  }
})
