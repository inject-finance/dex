import { HttpStatus, HttpException } from '@nestjs/common'
import type { ExceptionResponse } from '../interfaces/exceptions.interface'

export abstract class BaseException extends HttpException {
  constructor(response: ExceptionResponse, status: HttpStatus) {
    super(response, status)
  }

  abstract getResponse(): ExceptionResponse
}
