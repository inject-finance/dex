import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator'

export class FindUserByAddressDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  @IsString()
  address: string
}
