import { type NestMiddleware, Injectable } from '@nestjs/common'
import type { NextFunction } from 'express'
import { constants } from '../constants'

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(req: any, _: any, next: NextFunction) {
    const { pagination } = constants
    req.query.limit ||= pagination.defaultLimit
    req.query.page ||= pagination.defaultPage
    req.query.limit =
      req.query.limit > pagination.defaultMaxLimit
        ? pagination.defaultLimit
        : req.query.limit
    req.query.skip =
      // eslint-disable-next-line no-magic-numbers
      (req.query.page - (pagination.defaultPage - 1)) * req.query.limit
    req.query.search ||= ''
    next()
  }
}
