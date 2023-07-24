import { Token } from '@/common/types/Token'
import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { SwapCommand, swapCommand } from './swap.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/contracts/services/router/RouterContractService')
jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/features/ui/loading.state')

describe('When swapCommand is called', () => {
  const initialState = {
    tokenA: {
      address: 'mockTokenAAddress',
      symbol: 'mockTokenASymbol',
      amount: '1'
    } as Token,
    tokenB: {
      address: 'mockTokenBAddress',
      symbol: 'mockTokenBSymbol',
      amount: '1'
    } as Token,
    slippage: 0.5,
    routerContractService,
    transactionHash: ''
  } as SwapCommand

  it('and is successful', async () => {
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    await swapCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.tokenA.amount is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, amount: undefined }
    }

    await expect(swapCommand(state)).rejects.toThrow(
      CommandsError.TOKEN_A_AMOUNT_REQUIRED
    )
  })

  it('and fails when state.tokenA.address is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, address: undefined }
    }

    await expect(swapCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_A_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenB.address is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, address: undefined }
    }

    await expect(swapCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_B_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenB.amount is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, amount: undefined }
    }

    await expect(swapCommand(state)).rejects.toThrow(
      CommandsError.TOKEN_B_AMOUNT_REQUIRED
    )
  })

  it('and fails when state.slippage is less than 0', async () => {
    const state = {
      ...initialState,
      slippage: -1
    }

    await expect(swapCommand(state)).rejects.toThrow(
      CommandsError.SLIPPAGE_REQUIRED
    )
  })

  it('and fails when state.slippage is greater than 10', async () => {
    const state = {
      ...initialState,
      slippage: 11
    }

    await expect(swapCommand(state)).rejects.toThrow(
      CommandsError.SLIPPAGE_LIMITED_IN_10_PERCENT
    )
  })
})
