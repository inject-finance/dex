export type Token = {
  id: string
  symbol: string
  name: string
  address: string
  amount?: string
}

export type TokenId = Pick<Token, 'id'>
export type TokenAmount = Pick<Token, 'amount'>
export type TokenSymbol = Pick<Token, 'symbol'>
export type TokenAddress = Pick<Token, 'address'>
export type TokenPair = { tokenA: Token; tokenB: Token }
