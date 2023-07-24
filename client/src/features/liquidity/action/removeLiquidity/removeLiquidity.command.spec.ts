import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { ContractTransaction } from 'ethers'
import {
  RemoveLiquidityCommand,
  removeLiquidityCommand
} from './removeLiquidity.command '

jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/contracts/services/dexPool/DexPoolContractService')
jest.mock('@/contracts/services/router/RouterContractService')
jest.mock('@/features/ui/loading.state')

describe('When removeLiquidityCommand is called', () => {
  const initialState = {
    poolAddress: 'mockPoolAddress',
    account: { address: '' } as User,
    dexPoolContractService,
    routerContractService,
    transactionHash: 'mockTransactionHash',
    tokenA: { address: 'mockTokenAAddress' } as Token,
    tokenB: { address: 'mockTokenBAddress' } as Token,
    shares: 0,
    gasUsed: 0
  } as RemoveLiquidityCommand

  it('and is successful', async () => {
    const approvalTransaction = { wait: jest.fn() }
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    jest
      .mocked(initialState.dexPoolContractService.approve)
      .mockResolvedValue(approvalTransaction as unknown as ContractTransaction)

    await approvalTransaction.wait()

    const transaction = { wait: jest.fn() }
    jest
      .mocked(initialState.routerContractService.removeLiquidity)
      .mockResolvedValue(transaction as unknown as ContractTransaction)

    await transaction.wait()

    await removeLiquidityCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })
})
