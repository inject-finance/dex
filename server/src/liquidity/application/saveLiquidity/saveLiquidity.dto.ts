import { IsString, IsUUID } from 'class-validator'

export class SaveLiquidityDto {
  @IsUUID()
  @IsString()
  userId: string

  @IsUUID()
  @IsString()
  poolId: string
}
