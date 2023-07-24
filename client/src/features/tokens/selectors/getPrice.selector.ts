import { TokenSymbol } from '@/common/types/Token'
import { selectorFamily } from 'recoil'

const getPriceHitbtc = async ({ symbol }: TokenSymbol) => {
  const res = await fetch(`/api-hitbtc/price/rate?from=${symbol}&to=USDT`)

  const data = await res.json()

  return Number(data[symbol].price)
}

const getPriceCoinGecko = async ({ symbol }: TokenSymbol) => {
  const res = await fetch(
    `/api-coin-gecko/simple/price?ids=${symbol}&vs_currencies=USD`
  )
  const data = await res.json()

  return Number(data[symbol.toLocaleLowerCase()].usd)
}

export const getPrice = async ({ symbol }: TokenSymbol): Promise<number> => {
  let priceReturned = await getPriceHitbtc({ symbol }).catch(() => 0)

  if (!priceReturned) {
    priceReturned = await getPriceCoinGecko({ symbol }).catch(() => 0)
  }

  return priceReturned
}

export const getPriceSelector = selectorFamily<number, TokenSymbol>({
  key: 'getPriceSelector',
  get: (token) => () => getPrice(token)
})
