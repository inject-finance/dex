import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { Like, Repository } from 'typeorm'
import { FindLiquidityByUserIdDto } from '../application/findLiquidityByUserIdAndPool/findLiquidityByUserId.dto'
import { Liquidity } from './liquidity.entity'
import { AppDataSource } from '@/database.module'

@Injectable()
export class LiquidityRepository extends Repository<Liquidity> {
  constructor() {
    super(Liquidity, AppDataSource.manager)
  }

  async findByUserId({ userId }: FindLiquidityByUserIdDto) {
    const liquidity = await this.find({
      where: [
        {
          user: new User(userId)
        }
      ],
      relations: { user: true, pool: { tokenA: true, tokenB: true } }
    })

    return {
      liquidity
    }
  }

  findUserPoolsByTokens({
    userId,
    key,
    value
  }: FindLiquidityByUserIdDto & { key?: string; value?: string }) {
    return this.find({
      where: [
        {
          user: new User(userId),
          pool: [
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
        }
      ],
      relations: { user: true, pool: { tokenA: true, tokenB: true } }
    })
  }
}
