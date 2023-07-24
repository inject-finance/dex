import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { EntityManager, Like, Repository } from 'typeorm'
import { FindLiquidityByUserIdDto } from '../application/findLiquidityByUserIdAndPool/findLiquidityByUserId.dto'
import { Liquidity } from './liquidity.entity'

@Injectable()
export class LiquidityRepository extends Repository<Liquidity> {
  constructor(manager: EntityManager) {
    super(Liquidity, manager)
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
