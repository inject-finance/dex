import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllTokensService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  run() {
    return this.tokensRepository.findAndCount()
  }
}
