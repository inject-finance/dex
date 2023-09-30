import type { PaginationDto } from '@/common/dto/pagination.dto'
import { AppDataSource } from '@/database.module'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { Repository, SelectQueryBuilder } from 'typeorm'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager)
  }

  async findAll({
    skip,
    limit
  }: PaginationDto): Promise<{ count: number; users: User[] }> {
    const query = this.getItemQueryBuilder().take(limit).skip(skip)

    const users = await query.getMany()
    const count = await query.getCount()

    return {
      count,
      users
    }
  }

  saveUser(dto: User): Promise<User> {
    const user = this.create(dto)
    return this.save(user)
  }

  async updateUser(dto: User): Promise<User> {
    await this.update({ id: dto.id }, dto)
    return dto
  }

  findById(id: string): Promise<User | null> {
    return this.getItemQueryBuilder().where('users.id = :id', { id }).getOne()
  }

  private getItemQueryBuilder(): SelectQueryBuilder<User> {
    return this.createQueryBuilder('users')
      .select([
        'users.id',
        'users.role',
        'users.email',
        'users.firstName',
        'users.lastName',
        'users.image',

        'notes.id',
        'notes.title',
        'notes.description',
        'notes.createdAt',
        'notes.updatedAt'
      ])
      .innerJoin('users.notes', 'notes')
  }
}
