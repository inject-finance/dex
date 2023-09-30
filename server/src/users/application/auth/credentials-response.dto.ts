import { User } from '@/users/domain/user.entity'

export class CredentialsResponseDto {
  // eslint-disable-next-line camelcase
  access_token: string

  user: User
}
