import type { PaginationDto } from '@/common/dto/pagination.dto'
import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllTokensService {
  constructor(private readonly repository: TokensRepository) {}

  run(paginationDto: PaginationDto) {
    return this.repository.findAll(paginationDto)
  }
}
