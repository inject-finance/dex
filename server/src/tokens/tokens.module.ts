import { Module } from '@nestjs/common'
import { TokensController } from './infrastructure/tokens.controller'
import { TokensRepository } from './domain/tokens.repository'
import { SaveTokenService } from './application/saveToken/saveToken'
import { FindAllTokensService } from './application/findAllTokens/findAllTokens'
import { PoolsRepository } from '../pools/domain/pools.repository'
import { SavePoolService } from '../pools/application/savePool/savePool'
import { FindAllPools } from '../pools/application/findAllPools/findAllPools'
import { PoolsController } from '../pools/infrastructure/pools.controller'
import { FindPoolByCriteria } from '../pools/application/findPoolByCriteria/findPoolByCriteria'
import { FindOneTokenByService } from './application/findOneTokenBy/findOneTokenBy'
import { FindTokensInPool } from './application/findTokensInPool/findTokensInPool'
import { FindTokensWithoutPool } from './application/findTokensWithoutPool/findTokensWithoutPool'
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { FindPoolsByTokens } from '@/pools/application/findPoolsByTokens/findPoolsByTokens'

@Module({
  imports: [],
  controllers: [TokensController, PoolsController],
  providers: [
    SaveTokenService,
    FindAllTokensService,
    FindOneTokenByService,
    SavePoolService,
    FindAllPools,
    FindTokensInPool,
    FindTokensWithoutPool,
    FindPoolsByTokens,
    FindPoolByCriteria,
    TokensRepository,
    PoolsRepository,
    LiquidityRepository
  ]
})
export class TokensModule {}
