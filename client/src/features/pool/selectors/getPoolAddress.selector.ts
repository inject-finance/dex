import { Token } from '@/common/types/Token'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { selectorFamily } from 'recoil'

export const getPoolAddressSelector = selectorFamily({
  key: 'getPoolAddressSelector',
  get:
    ({ tokenA, tokenB }: { tokenA: Token; tokenB: Token }) =>
    () =>
      poolFactoryContractService.getPairAddress(tokenA.address, tokenB.address)
})
