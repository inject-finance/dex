// Reference: https://www.jsonrpc.org/specification#error_object

export const enum JsonRpcErrorCode {
  PARSE_ERROR = 32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  SERVER_ERROR_INIT = -32000,
  SERVER_ERROR_END = -32099,
  ALREADY_PROCESSING = -32002,
  DENIED_TRANSACTION_SIGNATURE = 40001,
  ACTION_REJECTED = 'ACTION_REJECTED',
  INSUFFICIENT_OUTPUT_AMOUNT = 'execution reverted: insufficient output amount',
  INSUFFICIENT_FUNDS_FOR_GAS = 'err: insufficient funds for gas'
}
