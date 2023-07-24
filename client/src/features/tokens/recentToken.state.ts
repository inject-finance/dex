import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const recentTokenState = atom<Token[]>({
  key: 'recent-tokens',
  default: [],
  effects: [persistAtom]
})

export const pushRecentToken = (token: Token) => {
  const data = getRecoil(recentTokenState)

  const exists = data.some((e) => e.symbol === token.symbol)
  if (exists) return

  setRecoil(recentTokenState, (prev) => [token, ...prev].slice(0, 5))
}
export const removeRecentToken = (token: Token) => {
  const data = getRecoil(recentTokenState)

  const exists = data.find((e) => e.symbol === token.symbol)

  setRecoil(recentTokenState, (prev) =>
    [...prev].filter((e) => e.symbol !== exists?.symbol).slice(0, 5)
  )
}
