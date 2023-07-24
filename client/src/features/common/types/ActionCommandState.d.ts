import { Token } from '@/common/types/Token'
import { User } from '@/common/types/User'
import { IDexPoolContractService } from '@/contracts/services/dexPool/IDexPoolContractService'
import { IPoolFactoryContractService } from '@/contracts/services/factory/IPoolFactoryContractService'
import { IRouterContractService } from '@/contracts/services/router/IRouterContractService'
import { IStakePoolContractService } from '@/contracts/services/stake/IStakePoolContractService'
import { ITokenContractService } from '@/contracts/services/token/ITokenContractService'
import { Flows } from '../enums/Flows.enum'

export interface ActionCommandState {
  token: Token
  tokenA: Token
  tokenB: Token
  approved: boolean
  gasUsed: number
  shares: number
  stakeDuration: number
  shares: string
  sharesToStaking: string
  firstTime: boolean
  interestRate: number
  poolAddress: string
  minStakeAmount: string
  minReserve: string
  owner: User
  flow: Flows
  transactionHash: string
  initialDeposit: string
  tokenContractService: ITokenContractService
  routerContractService: IRouterContractService
  poolFactoryContractService: IPoolFactoryContractService
  dexPoolContractService: IDexPoolContractService
  stakePoolContractService: IStakePoolContractService
}

export type SharesToRemove = Pick<ActionCommandState, 'sharesToRemove'>
