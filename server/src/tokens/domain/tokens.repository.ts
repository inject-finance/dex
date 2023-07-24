import { PaginationDto } from '@/common/dto/pagination.dto'
import { Injectable } from '@nestjs/common'
import { EntityManager, Like, Repository } from 'typeorm'
import { Token } from './tokens.entity'

@Injectable()
export class TokensRepository extends Repository<Token> {
  constructor(manager: EntityManager) {
    super(Token, manager)
  }

  async findAll({ limit, skip, value, key }: PaginationDto) {
    const tokens = await this.find({
      take: limit,
      skip,
      where: value?.length
        ? { [String(key)]: Like(`%${value?.toLocaleUpperCase()}%`) }
        : undefined
    })
    const count = await this.count()

    return {
      count,
      tokens
    }
  }
}
