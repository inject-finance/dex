import { IsOptional, IsString } from 'class-validator'

export class SaveTokenDto {
  @IsOptional()
  id: string

  @IsString()
  address: string

  @IsString()
  name: string

  @IsString()
  symbol: string
}
