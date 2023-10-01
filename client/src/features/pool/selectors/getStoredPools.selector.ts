import { tokenService } from '@/common/services/token/Token.service'
import { type Pool } from '@/common/types/Pool'
import { authState } from '@/features/auth/auth.state'
import { atom, selector } from 'recoil'

export const getPoolsFilter = atom({
  key: 'getPoolsFilter',
  default: {
    tokenName: '',
    myPoolsCheck: false
  }
})

export const getStoredUserPoolsSelector = selector<Pool[]>({
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
    )
      .then((res) => res.json())
      .catch(() => [])

    return pools
  }
})
export const getStoredPoolsSelector = selector<Pool[]>({
  key: 'getStoredPoolsSelector',
  get: async ({ get }) => {
    const { tokenName, myPoolsCheck } = get(getPoolsFilter)

    let pools: Pool[]

    if (myPoolsCheck) {
      pools = get(getStoredUserPoolsSelector)
    } else {
      pools = await fetch(`/api/pools/tokens?key=name&value=${tokenName}`).then(
        (res) => res.json().catch(() => [])
      )
    }

    return pools
  }
})
