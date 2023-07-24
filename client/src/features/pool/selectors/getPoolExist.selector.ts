import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { poolState } from '@/features/pool/pool.state'
import { selector } from 'recoil'

export const getPoolExistSelector = selector({
  key: 'getPoolExistSelector',
  get: ({ get }) => {
    const { tokenA, tokenB } = get(poolState)
    return poolFactoryContractService.pairExists(tokenA.address, tokenB.address)
  }
})
