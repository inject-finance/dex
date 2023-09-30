import { HttpStatus } from '@nestjs/common'
import { BaseException } from './base.exception'
import { HttpErrors } from '../../constants'
import type { ExceptionResponse } from '../interfaces/exceptions.interface'

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super({} as ExceptionResponse, HttpStatus.NOT_FOUND)
    this.message = message
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = HttpErrors.not_found
    return {
      name,
      message: this.message || message,
      code
    }
  }
}
