import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { poolFactoryContractService } from '@/contracts/services/factory/PoolFactoryContractService'
import { processTransaction } from '@/features/common/utils/processTransaction'
import { ContractTransaction } from 'ethers'
import { CreatePoolCommand, createPoolCommand } from './createPool.command'
import { CommandsError } from '@/features/common/enums/CommandsError.enum'

jest.mock('@/features/common/utils/processTransaction')
jest.mock('@/contracts/services/factory/PoolFactoryContractService')
jest.mock('@/features/ui/loading.state')

describe('When createPoolCommand is called', () => {
  const initialState = {
    poolAddress: '',
    account: { address: 'mockMetamaskAddress' } as User,
    poolFactoryContractService,
    transactionHash: 'mockTransactionHash',
    tokenA: { address: 'mockTokenAAddress' } as Token,
    tokenB: { address: 'mockTokenBAddress' } as Token
  } as CreatePoolCommand

  it('and is successful', async () => {
    const transaction = { wait: jest.fn() }
    jest.mocked(processTransaction).mockResolvedValue({
      transactionHash: 'mockTransactionHash'
    } as any)

    jest
      .mocked(initialState.poolFactoryContractService.createPair)
      .mockResolvedValue(transaction as unknown as ContractTransaction)

    await transaction.wait()

    await createPoolCommand(initialState)

    expect(initialState).toMatchObject({
      transactionHash: 'mockTransactionHash'
    })
  })

  it('and fails when state.poolAddress is not empty', async () => {
    const state = {
      ...initialState,
      poolAddress: 'mockPoolAddress'
    }

    await expect(createPoolCommand(state)).rejects.toThrow(
      'Token pair already exist!'
    )
  })

  it('and fails when state.tokenA.address is missing', async () => {
    const state = {
      ...initialState,
      tokenA: { ...initialState.tokenA, address: undefined }
    }

    await expect(createPoolCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_A_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.tokenB.address is missing', async () => {
    const state = {
      ...initialState,
      tokenB: { ...initialState.tokenB, address: undefined }
    }

    await expect(createPoolCommand(state as any)).rejects.toThrow(
      CommandsError.TOKEN_B_ADDRESS_REQUIRED
    )
  })

  it('and fails when state.account.address is missing', async () => {
    const state = {
      ...initialState,
      account: { ...initialState.account, address: undefined }
    }

    await expect(createPoolCommand(state as any)).rejects.toThrow(
      CommandsError.METAMASK_ADDRESS_REQUIRED
    )
  })
})
