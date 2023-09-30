import { AppDataSource } from '@/database.module'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Token } from './tokens.entity'

@Injectable()
export class TokensRepository extends Repository<Token> {
  constructor() {
    super(Token, AppDataSource.manager)
  }

  findAll() {
    return this.findAndCount()
  }

  findByProperty({ property, value }: { property: string; value: string }) {
    return this.findOneBy({ [property]: value })
  }
}
