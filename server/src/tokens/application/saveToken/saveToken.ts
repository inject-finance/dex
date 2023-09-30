import { Injectable } from '@nestjs/common'
import { SaveTokenDto } from './saveToken.dto'
import { TokensRepository } from '@/tokens/domain/tokens.repository'

@Injectable()
export class SaveTokenService {
  constructor(private readonly tokensRepository: TokensRepository) {}

  run(dto: SaveTokenDto) {
    const data = this.tokensRepository.create({
      address: dto.address,
      name: dto.name,
      symbol: dto.symbol
    })

    return this.tokensRepository.save(data)
  }
}
