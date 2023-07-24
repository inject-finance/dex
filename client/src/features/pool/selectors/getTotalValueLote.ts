import { Token } from '@/common/types/Token'
import { getPriceSelector } from '@/features/tokens/selectors/getPrice.selector'
import { getReservesSelector } from '@/features/pool/selectors/getReserves.selector'
import { selectorFamily } from 'recoil'

export const getTotalValueLote = selectorFamily<
  number,
  { tokenA: Token; tokenB: Token }
>({
  key: 'getTotalValueLote',
  get:
    ({ tokenA, tokenB }) =>
    ({ get }) => {
      const reserves = get(getReservesSelector({ tokenA, tokenB }))

      const priceA = get(getPriceSelector(tokenA))
      const priceB = get(getPriceSelector(tokenB))

      return reserves.reserveA * priceA + reserves.reserveB * priceB
    }
})
