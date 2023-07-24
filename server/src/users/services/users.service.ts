import type { PaginationDto } from '@/common/dto/pagination.dto'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../domain/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(paginationDto: PaginationDto) {
    return this.usersRepository.findAll(paginationDto)
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id)
  }

  async findWriters(): Promise<User[]> {
    return this.usersRepository.findWriters()
  }

  async findAdmins(): Promise<User[]> {
    return this.usersRepository.findAdmins()
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email)
  }

  // async saveUser(dto: UserRequestDto): Promise<User> {
  //   const existentUser = await this.findByEmail(dto.email)
  //   if (!existentUser) return this.usersRepository.saveUser(dto)
  //   return existentUser
  // }

  // async updateUser(dto: UserRequestDto): Promise<UserRequestDto> {
  //   return this.usersRepository.updateUser(dto)
  // }
}
