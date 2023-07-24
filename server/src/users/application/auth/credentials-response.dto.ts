import { User } from '@/users/domain/user.entity'

export class CredentialsResponseDto {
  access_token: string
  user: User
}
