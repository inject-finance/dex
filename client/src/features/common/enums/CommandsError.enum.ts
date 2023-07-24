export const enum CommandsError {
  USER_ID_REQUIRED = 'User Id is required',
  TOKEN_A_ADDRESS_REQUIRED = 'Address A required',
  TOKEN_B_ADDRESS_REQUIRED = 'Address B required',
  TOKEN_A_AMOUNT_REQUIRED = 'Amount A required',
  TOKEN_B_AMOUNT_REQUIRED = 'Amount B required',
  SLIPPAGE_REQUIRED = 'Slippage is required',
  POOL_ADDRESS_NOT_FOUND = 'Pool Address not found',
  POOL_ADDRESS_REQUIRED = 'Pool Address required',
  TRANSACTION_UNSUCCESSFUL = 'Transaction unsuccessful',
  TRANSACTION_NOT_FOUND = 'Transaction not found',
  CONTRACT_RECEIPT_UNSUCCESSFUL = 'Contract receipt unsuccessful',
  CONTRACT_RECEIPT_NOT_FOUND = 'Contract receipt not found',
  METAMASK_ADDRESS_REQUIRED = 'Metamask address is required',
  ACCOUNT_ID_REQUIRED = 'Account id is required',
  STAKING_POOL_DOES_NOT_AVAILABLE = 'Staking pool does not available',
  FLOW_IS_NOT_DEFINED = 'Flow is not defined',
  SLIPPAGE_LIMITED_IN_10_PERCENT = 'Max Slippage is 10%'
}
