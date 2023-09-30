import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindOneTokenByService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  run(property: string, value: string) {
    return this.tokensRepository.findOneBy({ [property]: value })
  }
}
