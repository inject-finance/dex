import { Public } from '@/users/infrastructure/decorators/public.decorator'
import { Controller, Get, Param } from '@nestjs/common'
import { FindLiquidityById } from '../application/findLiquidityById/findLiquidityById'

@Controller('liquidity')
export class LiquidityController {
  constructor(private readonly findLiquidityById: FindLiquidityById) {}

  @Public()
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.findLiquidityById.run(id)
  }
}
