import { PaginationDto } from '@/common/dto/pagination.dto'
import { Injectable } from '@nestjs/common'
import { EntityManager, Like, Repository } from 'typeorm'
import { Pool } from './pool.entity'

@Injectable()
export class PoolsRepository extends Repository<Pool> {
  constructor(manager: EntityManager) {
    super(Pool, manager)
  }

  findAll({ key, value }: { key: string; value: string }) {
    return this.find({
      where: value.length
        ? [
            {
              tokenA: {
                [String(key)]: Like(`%${value?.toLocaleUpperCase()}%`)
              }
            },
            {
              tokenB: {
                [String(key)]: Like(`%${value?.toLocaleUpperCase()}%`)
              }
            }
          ]
        : undefined,
      relations: { tokenA: true, tokenB: true }
    })
  }
}
