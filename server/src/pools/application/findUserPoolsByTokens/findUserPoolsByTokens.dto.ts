import { IsString, IsUUID } from 'class-validator'

export class FindUserPoolsByTokensDto {
  @IsUUID()
  @IsString()
  userId: string
}
