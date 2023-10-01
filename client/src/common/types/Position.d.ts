import { Pool } from './Pool'
import { User } from './User'

export type Position = {
  id: string
  user: User
  pool: Pool
  end: Date
  start: Date
  duration: number
  amount: number
}

export type PositionDuration = Pick<Position, 'end'>
export type PositionAmount = Pick<Position, 'amount'>
export type PositionDurationAndAmount = Pick<Position, 'amount' | 'duration'>
