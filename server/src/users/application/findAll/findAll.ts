import type { PaginationDto } from '@/common/dto/pagination.dto'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../domain/users.repository'

@Injectable()
export class FindAllUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async run(paginationDto: PaginationDto) {
    return this.usersRepository.findAll(paginationDto)
  }
}
