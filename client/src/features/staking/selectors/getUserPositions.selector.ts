import { tokenService } from '@/common/services/token/Token.service'
import { Liquidity } from '@/common/types/Liquidity'
import { Pool } from '@/common/types/Pool'
import { authState } from '@/features/auth/auth.state'
import { selector } from 'recoil'

export const getUserPositionsSelector = selector<{
  count: number
  pools: Pool[]
}>({
  key: 'getUserPositionsSelector',
  get: async ({ get }) => {
    const { account } = get(authState)

    const liquidity: Liquidity[] = await fetch(
      `/api/users/${account.id}/liquidity?key=${name}&value={value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenService.getToken()}`
        }
      }
    )
      .then((res) => res.json())
      .then((res) => res.liquidity)

    const pools = liquidity.map((e) => e.pool)

    return { pools, count: pools.length }
  }
})
