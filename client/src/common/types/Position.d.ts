import { User } from './User'

export type Position = {
  id: string
  user: User
  pool: Position
  end: Date
  start: Date
}

export type PositionDuration = Pick<Position, 'end'>
