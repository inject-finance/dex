import constants from '../../../common/configuration/constants'
import { type ITokenService } from './IToken.service'
import { type ILocalStorageService } from '../local-storage/ILocalStorage.service'
import { localStorageService } from '../local-storage/LocalStorage.service'
export class TokenService implements ITokenService {
  private readonly localStorageService: ILocalStorageService

  constructor(_localStorageService: ILocalStorageService) {
    this.localStorageService = _localStorageService
  }

  getToken(): string {
    const token = this.localStorageService.getItemRaw(constants.tokenKey)

    if (!token) return ''

    return token
  }
}

export const tokenService = new TokenService(localStorageService)
