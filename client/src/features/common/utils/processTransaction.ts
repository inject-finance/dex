import { CommandsError } from '@/features/common/enums/CommandsError.enum'
import { ValidationError } from '@/features/common/errors/ValidationError'
import { utils, type ContractTransaction } from 'ethers'

export const processTransaction = async (
  transaction: ContractTransaction | undefined
) => {
  if (!transaction)
    throw new ValidationError(CommandsError.TRANSACTION_NOT_FOUND)

  const contractReceipt = await transaction?.wait()
  if (!contractReceipt)
    throw new Error(CommandsError.CONTRACT_RECEIPT_UNSUCCESSFUL)

  const event = contractReceipt.events?.find((e) =>
    [
      'LogSwapTokensWithFees',
      'LogSwapTokensForETH',
      'LogSwapETHForTokens',
      'LogAddTokenToTokenLiquidity',
      'LogAddLiquidityETH',
      'LogCreatePair',
      'LogRemoveLiquidity',
      'LogRemoveLiquidityETH',
      'LogClaimRewards',
      'LogStakeToken',
      'Approval'
    ].includes(e.event as string)
  )

  if (!event) {
    throw new Error(CommandsError.CONTRACT_RECEIPT_NOT_FOUND)
  }

  return {
    gasUsed: Number(utils.formatEther(contractReceipt?.gasUsed)),
    transactionHash: contractReceipt.transactionHash,
    contractReceipt,
    event
  }
}
