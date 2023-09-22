import { tokenService } from '@/common/services/token/Token.service'
import { type Pool } from '@/common/types/Pool'
import { authState } from '@/features/auth/auth.state'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import e from 'express'
import { atom, selector } from 'recoil'

export const getPoolsFilter = atom({
  key: 'getPoolsFilter',
  default: {
    tokenName: '',
    myPoolsCheck: false
  }
})

export const getUserPoolsSelector = selector<Pool[]>({
  key: 'getUserPoolsSelector',
  get: async ({ get }) => {
    const { account } = get(authState)
    const { tokenName } = get(getPoolsFilter)

    const pools: Pool[] = await fetch(
      `/api/users/${account.id}/pools/tokens?key=name&value=${tokenName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenService.getToken()}`
        }
      }
    ).then((res) => res.json())

    return pools
  }
})
export const getPoolsSelector = selector<{
  count: number
  pools: Pool[]
}>({
  key: 'getPoolsSelector',
  get: async ({ get }) => {
    const { tokenName, myPoolsCheck } = get(getPoolsFilter)

    let pools: Pool[]

    if (myPoolsCheck) {
      pools = get(getUserPoolsSelector)
    } else {
      pools = await fetch(`/api/pools/tokens?key=name&value=${tokenName}`).then(
        (res) => res.json()
      )
    }

    // Promise.all(
    //   pools.map((e) => {
    //     const isStakeable = get(
    //       getIsStakedPoolSelector({ tokenA: e.tokenA, tokenB: e.tokenB })
    //     )

    //     e.isStakeable = isStakeable

    //     return e
    //   })
    // )

    return {
      pools,
      count: pools.length
    }
  }
})
