import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import {
  StorePositionCommand,
  storePositionCommand
} from './storePosition.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/features/ui/loading.state')

describe('When storePositionCommand is called', () => {
  const initialState = {
    poolAddress: 'mockPoolAddress',
    account: { id: 'mockAccountId' } as User,
    tokenA: { address: 'mockTokenAAddress' } as Token,
    tokenB: { address: 'mockTokenBAddress' } as Token,
    stakeDuration: 1
  } as StorePositionCommand

  it('and is successful', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ id: 'mockPoolId' })
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({})
        } as Response)
      )

    await storePositionCommand(initialState)

    expect(initialState).toMatchObject({})
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(storePositionCommand(state)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.account.id is missing', async () => {
    const state = {
      ...initialState,
      account: { ...initialState.account, id: undefined }
    }

    await expect(storePositionCommand(state as any)).rejects.toThrow(
      CommandsError.ACCOUNT_ID_REQUIRED
    )
  })
  it('and fails when state.tokenA.address is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, address: undefined }
    }

    await expect(storePositionCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_A_ADDRESS_REQUIRED
    )
  })
  it('and fails when state.tokenB.address is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, address: undefined }
    }

    await expect(storePositionCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_B_ADDRESS_REQUIRED
    )
  })
})
