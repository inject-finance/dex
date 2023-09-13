import { Token } from '@/common/types/Token'
import { selectorFamily } from 'recoil'

export const getTokenBySymbol = selectorFamily({
  key: 'getTokenBySymbol',
  get: (symbol: string) => async () => {
    const res = await fetch(
      `/api/tokens/filter-one?property=symbol&value=${String(symbol)}`
    )
    const token: Token = await res.json()
    return token
  }
})
