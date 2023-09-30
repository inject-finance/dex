import { Module } from '@nestjs/common'
import { PoolsRepository } from '@/pools/domain/pools.repository'
import { SavePoolService } from '@/pools/application/savePool/savePool'
import { FindAllPools } from '@/pools/application/findAllPools/findAllPools'
import { PoolsController } from './infrastructure/pools.controller'
import { FindPoolByCriteria } from '@/pools/application/findPoolByCriteria/findPoolByCriteria'
import { FindPoolsByTokens } from './application/findPoolsByTokens/findPoolsByTokens'

@Module({
  imports: [],
  controllers: [PoolsController],
  providers: [
    SavePoolService,
    FindPoolsByTokens,
    FindAllPools,
    FindPoolByCriteria,
    PoolsRepository
  ]
})
export class PoolsModule {}
