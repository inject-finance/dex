import { tokenService } from '@/common/services/token/Token.service'
import { User } from '@/common/types/User'
import {
  StoreLiquidityCommand,
  storeLiquidityCommand
} from './storeLiquidity.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/common/services/token/Token.service')
jest.mock('@/features/ui/loading.state')

describe('When storeLiquidityCommand is called', () => {
  const initialState = {
    account: { id: 'mockAccountId' } as User,
    poolAddress: 'mockPoolAddress'
  } as StoreLiquidityCommand

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

    jest.spyOn(tokenService, 'getToken').mockReturnValue('mockToken')

    await storeLiquidityCommand(initialState)

    expect(initialState).toMatchObject({})
  })

  it('and fails when state.account.id is missing', async () => {
    const state = {
      ...initialState,
      account: { ...initialState.account, id: undefined }
    }

    await expect(storeLiquidityCommand(state as any)).rejects.toThrow(
      CommandsError.USER_ID_REQUIRED
    )
  })

  it('and fails when state.poolAddress is missing', async () => {
    const state = {
      ...initialState,
      poolAddress: undefined
    }

    await expect(storeLiquidityCommand(state as any)).rejects.toThrow(
      CommandsError.POOL_ADDRESS_REQUIRED
    )
  })
})
