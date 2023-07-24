import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'
import { SaveTokenDto } from './saveToken.dto'

@Injectable()
export class SaveTokenService {
  constructor(private readonly repository: TokensRepository) {}

  async run(dto: SaveTokenDto) {
    const data = this.repository.create({
      address: dto.address,
      name: dto.name,
      symbol: dto.symbol
    })

    return this.repository.save(data)
  }
}
