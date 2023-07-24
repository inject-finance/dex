import { Position } from '@/common/types/Position'
import { Token } from '@/common/types/Token'
import { authState } from '@/features/auth/auth.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { selectorFamily } from 'recoil'

export const getPositionFromApiByPoolAddressSelector = selectorFamily({
  key: 'getPositionFromApiByPoolAddressSelector',
  get:
    (payload: { tokenA: Token; tokenB: Token }) =>
    async ({ get }) => {
      const { account } = get(authState)

      if (!account.address) {
        return undefined as unknown as Position
      }
      const poolAddress = get(
        getPoolAddressSelector({
          tokenA: payload.tokenA,
          tokenB: payload.tokenB
        })
      )

      const position: Position = await fetch(
        `/api/positions/user/${account.id}/pools/${poolAddress}`
      )
        .then((res) => res.json())
        .catch(() => undefined as unknown as Position)

      return position
    }
})
