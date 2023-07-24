/* eslint-disable max-params */
import { type Token } from '@/common/types/Token'
import { UserAddress } from '@/common/types/User'
import { type DexRouter } from '@/contracts/types/DexRouter'
import { utils, type ContractTransaction } from 'ethers'
import { DexRouterConstants } from '../../data/DexRouter.constants'
import { createAsyncContract } from '../../utils/createContract'
import { tokenContractService } from '../token/TokenContractService'
import { type IRouterContractService } from './IRouterContractService'

export class RouterContractService implements IRouterContractService {
  private declare contract: DexRouter | null

  constructor() {
    this.contract = null
  }

  public async init(): Promise<void> {
    this.contract = (await createAsyncContract<DexRouter>(
      DexRouterConstants.address,
      DexRouterConstants.abi
    )) as DexRouter
  }

  public async getReserves(tokenA: Token, tokenB: Token) {
    try {
      await this.init()

      const res = await this.contract?.getTokenPairReserves(
        tokenA.address,
        tokenB.address
      )

      if (!res) {
        throw new Error("Doesn't have reserves")
      }

      return {
        reserveA: Number(utils.formatEther(res.amount0)),
        reserveB: Number(utils.formatEther(res.amount1))
      }
    } catch (error) {
      return {
        reserveA: 0,
        reserveB: 0
      }
    }
  }

  public async swap(tokenA: Token, tokenB: Token) {
    await this.init()

    if (tokenA.symbol === 'ETH') {
      return this.contract?.swapETHForTokens(
        tokenB.address,
        await tokenContractService.parseUnits(tokenB),
        { value: await tokenContractService.parseUnits(tokenA) }
      )
    }

    if (tokenB.symbol === 'ETH') {
      return this.contract?.swapTokensForETH(
        tokenA.address,
        await tokenContractService.parseUnits(tokenA),
        await tokenContractService.parseUnits(tokenB)
      )
    }

    return this.contract?.swapTokensWithFees(
      tokenA.address,
      tokenB.address,
      await tokenContractService.parseUnits(tokenA),
      await tokenContractService.parseUnits(tokenB)
    )
  }

  public async getTokensOutAmount(
    tokenA: Token,
    tokenB: Token
  ): Promise<number> {
    try {
      if (
        !Number(tokenA.amount) ||
        isNaN(Number(tokenA.amount)) ||
        !isFinite(Number(tokenA.amount))
      ) {
        return 0
      }

      await this.init()
      const outAmount = await this.contract?.getTokenAmountOut(
        tokenA.address,
        tokenB.address,
        await tokenContractService.parseUnits(tokenA)
      )

      return outAmount
        ? Number(await tokenContractService.formatUnits(tokenB, outAmount))
        : 0
    } catch (error) {
      return 0
    }
  }

  public async addLiquidity(
    tokenA: Token,
    tokenB: Token
  ): Promise<ContractTransaction | undefined> {
    await this.init()

    if (tokenA.symbol === 'ETH' || tokenB.symbol === 'ETH') {
      const eth = tokenA.symbol === 'ETH' ? tokenA : tokenB
      const token = tokenA.symbol === 'ETH' ? tokenB : tokenA

      return this.contract?.addLiquidityETH(
        token.address,
        await tokenContractService.parseUnits(token),
        0,
        0,
        { value: utils.parseEther(String(eth.amount)) }
      )
    }

    if (tokenA.symbol !== 'ETH' && tokenB.symbol !== 'ETH') {
      return this.contract?.addTokenToTokenLiquidity(
        tokenA.address,
        tokenB.address,
        await tokenContractService.parseUnits(tokenA),
        await tokenContractService.parseUnits(tokenB),
        0,
        0
      )
    }

    return undefined
  }

  public async getTokenPairRatio(tokenA: Token, tokenB: Token) {
    try {
      if (isNaN(Number(tokenA.amount)) || !Number(tokenA.amount)) {
        return 0
      }

      await this.init()
      const ratio = await this.contract?.getTokenPairRatio(
        tokenA.address,
        tokenB.address,
        await tokenContractService.parseUnits(tokenA)
      )

      return ratio
        ? Number(await tokenContractService.formatUnits(tokenB, ratio))
        : 0
    } catch (error) {
      return 0
    }
  }

  public getTokenPairReserves(tokenA: string, tokenB: string) {
    return this.contract?.getTokenPairReserves(tokenA, tokenB)
  }

  public async removeLiquidity(
    tokenA: Token,
    tokenB: Token,
    { address }: UserAddress,
    shares: number
  ): Promise<ContractTransaction | undefined> {
    await this.init()

    if (tokenA.symbol === 'ETH' || tokenB.symbol === 'ETH') {
      const token = tokenA.symbol === 'ETH' ? tokenB : tokenA
      return this.contract?.removeLiquidityETH(
        token.address,
        utils.parseEther(String(shares)),
        0,
        0,
        address
      )
    }

    if (tokenA.symbol !== 'ETH' && tokenB.symbol !== 'ETH') {
      return this.contract?.removeLiquidity(
        tokenA.address,
        tokenB.address,
        utils.parseEther(String(shares)),
        0,
        0,
        address
      )
    }

    return undefined
  }
}

export const routerContractService = new RouterContractService()
