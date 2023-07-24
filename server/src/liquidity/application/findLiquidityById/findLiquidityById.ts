import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindLiquidityById {
  constructor(private readonly repository: LiquidityRepository) {}

  run(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: { user: true, pool: { tokenA: true, tokenB: true } }
    })
  }
}
