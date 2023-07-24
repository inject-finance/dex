import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '../application/auth/auth.service'
import { FindUserByAddress } from '../application/findUserByAddress/findUserByAddress'
import { Public } from './decorators/public.decorator'
import { SignInRequestDto } from '../application/auth/sign-in-request.dto'
import { CredentialsResponseDto } from '../application/auth/credentials-response.dto'
import { CredentialsRequestDto } from '../application/auth/credentials-request.dto'
import { IsAddressValid } from './decorators/address.decorator'
import { FindUserByAddressDto } from '../application/findUserByAddress/findUserByAddress.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private findUserByAddress: FindUserByAddress
  ) {}

  @Public()
  @Post('/sign-in')
  signIn(
    @Body() credentials: SignInRequestDto
  ): Promise<CredentialsResponseDto> {
    return this.authService.signIn(credentials)
  }

  @Public()
  @Post('/nonce')
  getNonce(@Body() authCredentialsDto: CredentialsRequestDto): Promise<string> {
    return this.authService.getNonce(authCredentialsDto)
  }

  @IsAddressValid()
  @Post('/authenticate')
  authenticate(@Body() dto: FindUserByAddressDto) {
    return this.findUserByAddress.run(dto)
  }
}
