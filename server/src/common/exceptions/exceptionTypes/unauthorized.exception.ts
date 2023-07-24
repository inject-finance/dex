import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'
import { HttpErrors } from '../../constants'
import type { ExceptionResponse } from '../interfaces/exceptions.interface'
import type { ExceptionSchema } from '../types/exceptionSchema'

export class UnauthorizedException extends BaseException {
  constructor(private readonly error?: ExceptionSchema, message?: string) {
    super({} as ExceptionResponse, HttpStatus.UNAUTHORIZED)
    this.message = message ?? ''
    this.error = error
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = HttpErrors.unauthorized
    return {
      name: this.error?.name ?? name,
      message: (this.message || this.error?.message) ?? message,
      code: this.error?.code ?? code
    }
  }
}
