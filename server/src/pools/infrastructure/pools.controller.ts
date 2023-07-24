import { PaginationDto } from '@/common/dto/pagination.dto'
import { Public } from '@/users/infrastructure/decorators/public.decorator'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { FindAllPools } from '../application/findAllPools/findAllPools'
import { SavePoolService } from '../application/savePool/savePool'
import { SavePoolDto } from '../application/savePool/savePool.dto'
import { FindPoolByCriteria } from '../application/findPoolByCriteria/findPoolByCriteria'

@Controller('pools')
export class PoolsController {
  constructor(
    private readonly savePool: SavePoolService,
    private readonly findAllPoolsByTokens: FindAllPools,
    private readonly findPoolByCriteria: FindPoolByCriteria
  ) {}

  @Public()
  @Post()
  save(@Body() dto: SavePoolDto) {
    return this.savePool.run(dto)
  }

  @Public()
  @Get('/')
  findAll(@Query() dto: { key: string; value: string }) {
    return this.findAllPoolsByTokens.run(dto)
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
