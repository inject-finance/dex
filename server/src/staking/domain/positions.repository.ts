import { AppDataSource } from '@/database.module'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Position } from './position.entity'

@Injectable()
export class PositionsRepository extends Repository<Position> {
  constructor() {
    super(Position, AppDataSource.manager)
  }
}
