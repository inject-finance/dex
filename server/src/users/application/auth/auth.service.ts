import { UsersRepository } from '@/users/domain/users.repository'
import { BusinessErrors } from '@/common/constants'
import {
  BusinessException,
  UnauthorizedException
} from '@/common/exceptions/exceptionTypes'
import { Cache } from 'cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { createHmac } from 'crypto'
import { CredentialsRequestDto } from './credentials-request.dto'
import { CredentialsResponseDto } from './credentials-response.dto'
import { recoverPersonalSignature } from '@metamask/eth-sig-util'
import { SignInRequestDto } from './sign-in-request.dto'
import { v4 as uuidv4 } from 'uuid'
import { appConfig } from '@/common/config/app.config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // eslint-disable-next-line max-statements
  async signIn({
    nonce,
    signature
  }: SignInRequestDto): Promise<CredentialsResponseDto> {
    if (!nonce) throw new BusinessException(BusinessErrors.nonce_required)
    if (!signature)
      throw new BusinessException(BusinessErrors.signature_required)

    const address = recoverPersonalSignature({ data: nonce, signature })
    const cachedNonce = await this.cacheManager.get<string>(address)

    if (nonce === cachedNonce) {
      let account = await this.usersRepository.findOneBy({ address })

      if (!account) {
        account = this.usersRepository.create({
          address: address.toLocaleLowerCase()
        })

        await this.usersRepository.save(account)
      }

      const access_token = this.jwtService.sign({
        address: account.address
      })

      this.cacheManager.del(address)

      return { access_token, user: account }
    }

    throw new UnauthorizedException()
  }

  async getNonce({ address }: CredentialsRequestDto): Promise<string> {
    if (!address) throw new BusinessException(BusinessErrors.address_required)

    const { nonceTimeExpirationInMilliseconds } = appConfig()
    const nonce = createHmac('sha256', uuidv4()).digest('hex')

    await this.cacheManager.set(
      address,
      nonce,
      nonceTimeExpirationInMilliseconds
    )

    return nonce
  }
}
