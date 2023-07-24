import { Token } from '@/common/types/Token'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { StorePoolCommand, storePoolCommand } from './storePool.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/contracts/services/factory/PoolFactoryContractService')
jest.mock('@/features/ui/loading.state')

describe('When storePoolCommand is called', () => {
  const initialState = {
    poolFactoryContractService,
    tokenA: {
      address: 'mockTokenAAddress',
      symbol: 'mockTokenASymbol'
    } as Token,
    tokenB: {
      address: 'mockTokenBAddress',
      symbol: 'mockTokenBSymbol'
    } as Token
  } as StorePoolCommand

  it('and is successful', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: 'mockTokenAId' })
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: 'mockTokenBId' })
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({})
        } as Response)
      )

    jest
      .mocked(initialState.poolFactoryContractService.getPairAddress)
      .mockResolvedValue('mockPoolAddress')

    await storePoolCommand(initialState)

    expect(initialState).toMatchObject({})
  })

  it('and fails when state.tokenA.address is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, address: undefined }
    }

    await expect(storePoolCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_A_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenB.address is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, address: undefined }
    }

    await expect(storePoolCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_B_ADDRESS_REQUIRED
    )
  })
})
