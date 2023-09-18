/* eslint-disable max-params */
import { Public } from '@/users/infrastructure/decorators/public.decorator'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { FindAllTokensService } from '../application/findAllTokens/findAllTokens'
import { FindOneTokenByService } from '../application/findOneTokenBy/findOneTokenBy'
import { FindTokensInPool } from '../application/findTokensInPool/findTokensInPool'
import { FindTokensWithoutPool } from '../application/findTokensWithoutPool/findTokensWithoutPool'
import { SaveTokenService } from '../application/saveToken/saveToken'
import { SaveTokenDto } from '../application/saveToken/saveToken.dto'

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly saveToken: SaveTokenService,
    private readonly findAllTokens: FindAllTokensService,
    private readonly findOneTokenByService: FindOneTokenByService,
    private readonly findTokensInPool: FindTokensInPool,
    private readonly findTokensWithoutPool: FindTokensWithoutPool
  ) {}

  @Public()
  @Post()
  save(@Body() dto: SaveTokenDto) {
    return this.saveToken.run(dto)
  }

  @Public()
  @Get('/')
  findAll() {
    return this.findAllTokens.run()
  }

  @Public()
  @Get('/filter-one')
  findByAddress(
    @Query('property') property: string,
    @Query('value') value: string
  ) {
    return this.findOneTokenByService.run(property, value)
  }

  @Public()
  @Get('/tokens-in-pool/:tokenSymbol')
  findAvailableTokens(@Param('tokenSymbol') tokenSymbol: string) {
    return this.findTokensInPool.run({ tokenSymbol })
  }

  @Public()
  @Get('/tokens-without-pool/:tokenSymbol')
  tokensWithoutPool(@Param('tokenSymbol') tokenSymbol: string) {
    return this.findTokensWithoutPool.run({ symbol: tokenSymbol })
  }
}
