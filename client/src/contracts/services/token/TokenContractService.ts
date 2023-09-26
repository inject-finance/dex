import { type Token } from '@/common/types/Token'
import { type Token as IERC20 } from '@/contracts/types/Token'
import { utils, type BigNumber, type ContractTransaction } from 'ethers'
import { DexRouterConstants } from '../../data/DexRouter.constants'
import { TokenABI } from '../../data/TokenAbi'
import { createAsyncContract } from '../../utils/createContract'
import { type ITokenContractService } from './ITokenContractService'
import { metamaskService } from '@/features/auth/services/metamask-service/MetamaskService'

export class TokenContractService implements ITokenContractService {
  private declare contract: IERC20 | null

  constructor() {
    this.contract = null
  }

  public async init(token: Token): Promise<void> {
    if (token.address) {
      this.contract = await createAsyncContract<IERC20>(token.address, TokenABI)
    }
  }

  public async approve(token: Token): Promise<ContractTransaction | undefined> {
    if (token.symbol === 'ETH') {
      return undefined
    }

    await this.init(token)
    const amount = await this.parseUnits(token)

    return this.contract?.approve(DexRouterConstants.address, amount)
  }

  public checkAllowance(ownerAddress: string): Promise<BigNumber> | undefined {
    return this.contract?.allowance(ownerAddress, DexRouterConstants.address)
  }

  public async getBalance(token: Token): Promise<number> {
    const account = await metamaskService.getAccount()

    if (!account) {
      return 0
    }

    if (token.symbol === 'ETH') {
      return metamaskService.getBalance()
    }

    await this.init(token)

    const balance = await this.contract
      ?.balanceOf(account)
      .catch(() => undefined)
    return balance ? Number(await this.formatUnits(token, balance)) : 0
  }

  public async formatUnits(token: Token, quantity: BigNumber): Promise<number> {
    await this.init(token)
    const decimals = await this.contract?.decimals()
    return Number(utils.formatUnits(quantity, decimals))
  }

  public async parseUnits(token: Token): Promise<BigNumber> {
    await this.init(token)
    const decimals = await this.contract?.decimals()
    const amount = token.amount?.toString() || '0'

    if (!decimals || isNaN(decimals)) {
      throw new Error('Invalid decimals')
    }

    return utils.parseUnits(amount, decimals.toString())
  }
}
export const tokenContractService = new TokenContractService()
