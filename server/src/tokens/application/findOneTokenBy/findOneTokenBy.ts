import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindOneTokenByService {
  constructor(private readonly repository: TokensRepository) {}

  async run(property: string, value: string) {
    return this.repository.findOneBy({ [property]: value })
  }
}
