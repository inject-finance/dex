import { TokenPair } from '@/common/types/Token'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { selectorFamily } from 'recoil'

export const getReservesSelector = selectorFamily({
  key: 'getReservesSelector',
  get:
    ({ tokenA, tokenB }: TokenPair) =>
    () =>
      routerContractService.getReserves(tokenA, tokenB)
})

export const getHasReservesSelector = selectorFamily<boolean, TokenPair>({
  key: 'getHasReservesSelectorByTokensSelector',
  get:
    ({ tokenA, tokenB }) =>
    ({ get }) => {
      const reserves = get(getReservesSelector({ tokenA, tokenB }))

      return Boolean(reserves.reserveA && reserves.reserveB)
    }
})
