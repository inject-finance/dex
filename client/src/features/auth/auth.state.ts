import { type User } from '@/common/types/User'
import { NetworkNames } from '@/features/auth/enums/network-names.enum'
import { atom } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'

export type AuthState = {
  account: User
  isAuthenticated: boolean
  isMainnet: boolean
  isLoading: boolean
  isMounting: boolean
  metamaskIsUnlocked: boolean
  network: NetworkNames
}

export const initialAuthState: AuthState = {
  account: {
    address: ''
  } as User,
  isAuthenticated: false,
  isLoading: false,
  isMainnet: false,
  isMounting: true,
  metamaskIsUnlocked: false,
  network: NetworkNames.MAINNET
}

export const authState = atom<AuthState>({
  key: 'auth',
  default: initialAuthState
})

export const setIsMounted = () => {
  setRecoil(authState, (prev) => ({ ...prev, isMounting: false }))
}

export const setAuthState = (state: Partial<AuthState>) => {
  setRecoil(authState, (prev) => ({ ...prev, ...state }))
}

export const setIsLoadingAuth = (state: boolean) => {
  setRecoil(authState, (prev) => ({
    ...prev,
    isLoading: state
  }))
}

export const getAuthenticatedAccount = () => getRecoil(authState).account
