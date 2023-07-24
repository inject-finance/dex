import constants from '@/common/configuration/constants'
import { HttpService } from '@/common/services/http/http.service'
import { localStorageService } from '@/common/services/local-storage/LocalStorage.service'
import { tokenService } from '@/common/services/token/Token.service'
import { type User } from '@/common/types/User'
import { AxiosError } from 'axios'
import type IAuthService from './IAuthService'

export default class AuthService extends HttpService implements IAuthService {
  private readonly endpoint: string

  constructor() {
    super()
    this.endpoint = 'auth'
  }

  async getNonce(address: string): Promise<string> {
    const response = await this.instance.post(`${this.endpoint}/nonce`, {
      address
    })
    return response.data
  }

  async signIn(signature: string, nonce: string): Promise<User> {
    const { data } = await this.instance.post<{
      access_token: string
      user: User
    }>(`${this.endpoint}/sign-in`, {
      signature,
      nonce
    })
    localStorageService.setItemRaw(constants.tokenKey, data.access_token)
    this.setToken(data.access_token)
    return data.user
  }

  async authenticateLocalToken(
    address: string
  ): Promise<{ token: string; account: User } | null> {
    const token = tokenService.getToken()

    if (token) {
      try {
        this.setToken(token)
        const { data } = await this.instance.post(
          `${this.endpoint}/authenticate`,
          { address }
        )
        return { token, account: data }
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          localStorageService.removeItem(constants.tokenKey)
        }
      }
    }

    return null
  }
}

export const authService = new AuthService()
