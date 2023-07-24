import { Injectable } from '@nestjs/common'
import { EntityManager, Repository } from 'typeorm'
import { Position } from './position.entity'

@Injectable()
export class PositionsRepository extends Repository<Position> {
  constructor(manager: EntityManager) {
    super(Position, manager)
  }
}
