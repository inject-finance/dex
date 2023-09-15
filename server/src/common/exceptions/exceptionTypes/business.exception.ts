import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'
import { BusinessErrors } from '../../constants'
import type { ExceptionResponse } from '../interfaces/exceptions.interface'
import type { ExceptionSchema } from '../types/exceptionSchema'

export class BusinessException extends BaseException {
  constructor(
    private readonly error?: ExceptionSchema,
    message?: string,
    status?: HttpStatus
  ) {
    super({} as ExceptionResponse, status ?? HttpStatus.BAD_REQUEST)
    this.message = message ?? ''
    this.error = error
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = BusinessErrors.default
    return {
      name: this.error?.name ?? name,
      message: (this.message || this.error?.message) ?? message,
      code: this.error?.code ?? code
    }
  }
}
