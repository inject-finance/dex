import { type ErrorCode } from '@ethersproject/logger'
import { type JsonRpcErrorCode } from '@/common/exceptions/json-rpc-error'

export interface ProviderRpcError extends Error {
  message: string
  code: ErrorCode | JsonRpcErrorCode
  data?: { code: number; message: string }
  reason: string
}
