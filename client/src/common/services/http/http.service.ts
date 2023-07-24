/* eslint-disable security/detect-object-injection */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'
import { toast } from 'react-toastify'
import {
  type ValidationError,
  type ValidationResponse
} from '@/common/services/http/types/error'
import { localStorageService } from '@/common/services/local-storage/LocalStorage.service'
import { ErrorHttpType } from '@/common/services/http/enums/error-http-type.enum'
import { TokenService } from '../token/Token.service'
import constants from '@/common/configuration/constants'

export abstract class HttpService {
  protected instance: AxiosInstance

  protected token?: string

  public constructor() {
    const tokenService = new TokenService(localStorageService)

    this.instance = axios.create({
      baseURL: constants.api.url
    })

    this.token = tokenService.getToken()

    this.initializeRequestInterceptor()
    this.initializeResponseInterceptor()
  }

  private readonly handleRequest = (config: AxiosRequestConfig): any => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${String(this.token)}`
    }
  })

  private readonly initializeRequestInterceptor = (): void => {
    this.instance.interceptors.request.use(this.handleRequest)
  }

  private readonly initializeResponseInterceptor = (): void => {
    this.instance.interceptors.response.use(
      (response) => response,
      this.handleError
    )
  }

  private readonly handleError = (error: AxiosError): Promise<never> => {
    const responseError = error.response?.data as ValidationResponse

    if (error.response?.status === 401) throw error

    if (error.response?.status === 400) {
      const msg = this.handleBusinessError(responseError)

      if (responseError.name === ErrorHttpType.SCHEMA_VALIDATION)
        toast.warn(msg)
      else toast.error(msg)

      throw error
    }

    toast.error(`${responseError.message}`)
    throw error
  }

  private handleBusinessError(data: ValidationResponse): string {
    let msg = `${data.message} `

    data.details?.forEach((detail: ValidationError) => {
      let constraintsSrg = ''

      if (!detail.constraints) return

      Object.keys(detail.constraints).forEach((key) => {
        constraintsSrg = `${constraintsSrg} 
        - ${String(detail.constraints?.[key])} `
      })
      msg = `${msg} ${constraintsSrg} `
    })

    return msg
  }

  protected setToken = (token: string): void => {
    this.token = token
    this.initializeRequestInterceptor()
  }
}
