import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class SaveTokenDto {
  @IsOptional()
  id: string

  @IsString()
  address: string

  @IsString()
  @Transform(({ value }: { value: string }) => value.toLocaleLowerCase())
  name: string

  @IsString()
  symbol: string
}
