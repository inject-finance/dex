import { IsString, IsUUID } from 'class-validator'

export class RemoveLiquidityDto {
  @IsUUID()
  @IsString()
  userId: string

  @IsUUID()
  @IsString()
  poolId: string
}
