import { InjectToken } from '@/contracts/types/InjectToken'
import { InjectTokenConstants } from '../../data/InjectToken.constants'
import { createAsyncContract } from '../../utils/createContract'
import { IInjectTokenContractService } from './IInjectTokenContractService'
import { StakePoolConstants } from '@/contracts/data/StakePool.constants'
import { utils } from 'ethers'

export class InjectTokenContractService implements IInjectTokenContractService {
  private declare contract: InjectToken | null

  public async init() {
    this.contract = await createAsyncContract<InjectToken>(
      InjectTokenConstants.address,
      InjectTokenConstants.abi
    )
  }

  public async approveStakingContract(initialDeposit: number) {
    await this.init()
    return this.contract?.approve(
      StakePoolConstants.address,
      utils.parseEther(String(initialDeposit))
    )
  }
}
export const injectTokenContractService = new InjectTokenContractService()
