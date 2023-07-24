import {
  IsEthereumAddress,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'

export class SavePoolDto {
  @IsOptional()
  id: string

  @IsEthereumAddress()
  @IsString()
  address: string

  @IsUUID()
  @IsString()
  tokenAId: string

  @IsUUID()
  @IsString()
  tokenBId: string
}
