import { type Token } from './Token'

export type Pool = {
  id: string
  address: string
  tokenA: Token
  tokenB: Token
}

export type PoolAddress = Pick<Pool, 'address'>
