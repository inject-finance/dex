import { Token } from '@/common/types/Token'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { ContractTransaction } from 'ethers'
import {
  AddLiquidityCommand,
  addLiquidityCommand
} from './addLiquidity.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/contracts/services/router/RouterContractService')
jest.mock('@/features/ui/loading.state')

describe('When addLiquidityCommand is called', () => {
  const initialState = {
    poolAddress: 'mockPoolAddress',
    routerContractService,
    transactionHash: 'mockTransactionHash',
    tokenA: { address: 'mockTokenAAddress', amount: '1' } as Token,
    tokenB: { address: 'mockTokenBAddress', amount: '1' } as Token
  } as AddLiquidityCommand

  it('and is successful', async () => {
    const transaction = { wait: jest.fn() }
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    jest
      .mocked(initialState.routerContractService.addLiquidity)
      .mockResolvedValue(transaction as unknown as ContractTransaction)

    await transaction.wait()

    await addLiquidityCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(addLiquidityCommand(state)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenA.amount is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, amount: undefined }
    }

    await expect(addLiquidityCommand(state)).rejects.toThrow(
      CommandsError.TOKEN_A_AMOUNT_REQUIRED
    )
  })

  it('and fails when state.tokenA.address is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, address: undefined }
    }

    await expect(addLiquidityCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_A_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenB.address is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, address: undefined }
    }

    await expect(addLiquidityCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_B_ADDRESS_REQUIRED
    )
  })
})
