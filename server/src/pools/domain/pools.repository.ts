import { AppDataSource } from '@/database.module'
import { Injectable } from '@nestjs/common'
import { Like, Repository } from 'typeorm'
import { Pool } from './pool.entity'

@Injectable()
export class PoolsRepository extends Repository<Pool> {
  constructor() {
    super(Pool, AppDataSource.manager)
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
