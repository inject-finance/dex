import { Injectable } from '@nestjs/common'
import type { SelectQueryBuilder } from 'typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from '@/users/domain/user.entity'
import type { PaginationDto } from '@/common/dto/pagination.dto'
import { Role } from '@/common/enums/role.enum'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
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

  async saveUser(dto: User): Promise<User> {
    const user = this.create(dto)
    return this.save(user)
  }

  async updateUser(dto: User): Promise<User> {
    await this.update({ id: dto.id }, dto)
    return dto
  }

  async findById(id: string): Promise<User | null> {
    return this.getItemQueryBuilder().where('users.id = :id', { id }).getOne()
  }

  async findWriters(): Promise<User[]> {
    return this.getItemQueryBuilder()
      .where('users.role = :role', { role: Role.WRITER })
      .getMany()
  }

  async findAdmins(): Promise<User[]> {
    return this.getItemQueryBuilder()
      .where('users.role = :role', { role: Role.ADMIN })
      .getMany()
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getItemQueryBuilder()
      .where('users.email = :email', { email })
      .getOne()
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
