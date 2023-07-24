import { BusinessErrors } from '@/common/constants'
import { BusinessException } from '@/common/exceptions/exceptionTypes'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../domain/users.repository'
import { FindUserByAddressDto } from './findUserByAddress.dto'

@Injectable()
export class FindUserByAddress {
  constructor(private readonly usersRepository: UsersRepository) {}

  async run({ address }: FindUserByAddressDto) {
    const user = await this.usersRepository.findOneBy({ address })

    if (!user) {
      throw new BusinessException(BusinessErrors.user_not_found)
    }

    return user
  }
}
