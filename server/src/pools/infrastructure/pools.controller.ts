/* eslint-disable max-params */
import { Public } from '@/users/infrastructure/decorators/public.decorator'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { FindAllPools } from '../application/findAllPools/findAllPools'
import { FindPoolsByTokens } from '../application/findPoolsByTokens/findPoolsByTokens'
import { FindPoolByCriteria } from '../application/findPoolByCriteria/findPoolByCriteria'
import { SavePoolService } from '../application/savePool/savePool'
import { SavePoolDto } from '../application/savePool/savePool.dto'

@Controller('pools')
export class PoolsController {
  constructor(
    private readonly savePool: SavePoolService,
    private readonly findAllPools: FindAllPools,
    private readonly findAllPoolsByTokens: FindPoolsByTokens,
    private readonly findPoolByCriteria: FindPoolByCriteria
  ) {}

  @Public()
  @Post()
  save(@Body() dto: SavePoolDto) {
    return this.savePool.run(dto)
  }

  @Public()
  @Get('/')
  findAll() {
    return this.findAllPools.run()
  }

  @Public()
  @Get('/tokens')
  findAllByTokens(@Query() dto: { key: string; value: string }) {
    return this.findAllPoolsByTokens.run(dto)
  }

  @Public()
  @Get('/criteria')
  findByCriteria(@Query('key') key: string, @Query('value') value: string) {
    return this.findPoolByCriteria.run({ key, value })
  }

  @Public()
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.findPoolByCriteria.run({ key: 'id', value: id })
  }
}
