import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Token } from '@/tokens/domain/tokens.entity'
import { Injectable } from '@nestjs/common'
import { SavePoolDto } from './savePool.dto'

@Injectable()
export class SavePoolService {
  constructor(private readonly repository: PoolsRepository) {}

  async run({ address, tokenAId, tokenBId }: SavePoolDto) {
    const pool = await this.repository.findOne({
      where: { tokenA: new Token(tokenAId), tokenB: new Token(tokenBId) }
    })

    if (pool) {
      return this.repository.update({ id: pool.id }, { address })
    }

    const data = this.repository.create({
      address,
      tokenA: new Token(tokenAId),
      tokenB: new Token(tokenBId)
    })

    return this.repository.save(data)
  }
}
