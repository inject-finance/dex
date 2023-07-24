export const constants = {
  database: 'database',
  pagination: {
    defaultLimit: 5,
    defaultPage: 1,
    defaultMaxLimit: 1000
  }
}

export const SchemaValidationErrors = {
  default: {
    name: 'SCHEMA_VALIDATION',
    message:
      'One or more fields contain incorrect values. Please verify and try again.',
    code: 1000
  }
}

export const HttpErrors = {
  unauthorized: {
    name: 'UNAUTHORIZED',
    message: 'You do not have permission to complete this request.',
    code: 2000
  },
  not_found: {
    name: 'NOT_FOUND',
    message: 'The resource that you are looking for does not exist.',
    code: 3000
  },
  default: {
    name: 'INTERNAL',
    message:
      'An internal error has occurred. Please help us improve our service by sending an error report.',
    code: 5000
  }
}

export const BusinessErrors = {
  default: {
    name: 'BAD_REQUEST',
    message:
      'An error has occurred while processing your request. Please verify your information and try again.',
    code: 4000
  },
  address_required: {
    name: 'ADDRESS_REQUIRED',
    message:
      'The address is required. Please verify your information and try again.',
    code: 4004
  },
  user_not_associated: {
    name: 'USER_ID_NOT_ASSOCIATED',
    message: 'The given userId does not have an account associated.',
    code: 4018
  },
  user_not_found: {
    name: 'USER_NOT_FOUND',
    message: 'User with that email was not found. Please try again later',
    code: 4021
  },
  signature_required: {
    name: 'SIGNATURE_REQUIRED',
    message:
      'The signature is required. Please verify your information and try again.',
    code: 4005
  },
  nonce_required: {
    name: 'NONCE_REQUIRED',
    message:
      'The nonce is required. Please verify your information and try again.',
    code: 4006
  }
}
