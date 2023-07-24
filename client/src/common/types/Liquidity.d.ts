import { Pool } from './Pool'
import { User } from './User'

export type Liquidity = {
  id: string
  createdAt: Date
  user: User
  pool: Pool
}
