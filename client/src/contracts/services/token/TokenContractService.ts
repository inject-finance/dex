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

    return this.contract?.approve(
      DexRouterConstants.address,
      await this.parseUnits(token)
    )
  }

  public checkAllowance(ownerAddress: string): Promise<BigNumber> | undefined {
    return this.contract?.allowance(ownerAddress, DexRouterConstants.address)
  }

  public async getBalance(
    token: Token,
    metamaskAddress: string
  ): Promise<number> {
    if (token.symbol === 'ETH') {
      return metamaskService.getBalance()
    }

    await this.init(token)

    const balance = await this.contract
      ?.balanceOf(metamaskAddress)
      .then(async (res) => Number(await this.formatUnits(token, res)))
      .catch(() => 0)

    if (!balance) {
      return 0
    }
    return balance
  }

  public async getDecimals(token: Token): Promise<number> {
    await this.init(token)
    const decimals = this.contract?.decimals()

    if (!decimals) {
      return 0
    }

    return decimals
  }

  public async formatUnits(token: Token, quantity: BigNumber): Promise<number> {
    await this.init(token)
    const decimals = await this.contract?.decimals()

    return Number(utils.formatUnits(quantity, decimals))
  }

  public async parseUnits(token: Token): Promise<BigNumber> {
    await this.init(token)
    const decimals = await this.contract?.decimals()

    return utils.parseUnits(String(token.amount || ''), String(decimals))
  }
}
export const tokenContractService = new TokenContractService()
