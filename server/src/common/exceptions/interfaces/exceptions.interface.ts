import type { ValidationError } from '@nestjs/common'
export interface ExceptionResponseBase {
  name: string
  message: string
  code: number
}

export interface ExceptionResponse extends ExceptionResponseBase {
  path?: string
  timestamp?: string
  correlationId?: string
}

export interface ValidationResponse extends ExceptionResponse {
  details?: ValidationError[]
}
