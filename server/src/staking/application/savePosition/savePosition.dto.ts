import { IsString, IsUUID } from 'class-validator'

export class SavePositionDto {
  @IsUUID()
  @IsString()
  userId: string

  @IsUUID()
  @IsString()
  poolId: string

  @IsString()
  start: string

  @IsString()
  end: string
}
