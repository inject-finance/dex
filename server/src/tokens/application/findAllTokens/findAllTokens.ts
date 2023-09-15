import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllTokensService {
  constructor(private readonly repository: TokensRepository) {}

  run() {
    return this.repository.findAndCount()
  }
}
