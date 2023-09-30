import { HttpStatus, ValidationError } from '@nestjs/common'
import { SchemaValidationErrors } from '../../constants'
import type {
  ExceptionResponse,
  ValidationResponse
} from '../interfaces/exceptions.interface'
import { BaseException } from './base.exception'

export class ValidationException extends BaseException {
  constructor(
    private readonly errors: ValidationError[],
    message?: string
  ) {
    super({} as ExceptionResponse, HttpStatus.BAD_REQUEST)
    this.message = message ?? ''
  }

  getResponse(): ValidationResponse {
    const { name, message, code } = SchemaValidationErrors.default
    return {
      name,
      message: this.message || message,
      code,
      details: this.errors
    }
  }
}
