import { IsString, IsUUID } from 'class-validator'

export class FindLiquidityByUserIdDto {
  @IsUUID()
  @IsString()
  userId: string
}
