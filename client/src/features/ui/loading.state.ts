import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const loadingState = atom({
  key: 'loading-state',
  default: { status: false, text: 'Working on it...' }
})

export const setIsLoading = (text?: string) => {
  setRecoil(loadingState, { status: Boolean(text), text: String(text) })
}
