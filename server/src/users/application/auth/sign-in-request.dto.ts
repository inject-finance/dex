import { IsNotEmpty } from 'class-validator'

export class SignInRequestDto {
  @IsNotEmpty()
  signature: string

  @IsNotEmpty()
  nonce: string
}
