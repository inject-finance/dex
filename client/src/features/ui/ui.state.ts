import { atom } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'

type UiState = {
  drawerIsOpen: boolean
  tokenListVisibility: boolean
  confirmationModalVisibility: boolean
  removeLiquidityModalVisibility: boolean
  tradeSettingsVisibility: boolean
  addStakingModalVisibility: boolean
  createPositionModalVisibility: boolean
  stakingDetailsModalVisibility: boolean
  setStakingPoolModalVisibility: boolean
  redeemRewardsModalVisibility: boolean
}

const initialState: UiState = {
  drawerIsOpen: false,
  tokenListVisibility: false,
  confirmationModalVisibility: false,
  removeLiquidityModalVisibility: false,
  tradeSettingsVisibility: false,
  addStakingModalVisibility: false,
  createPositionModalVisibility: false,
  stakingDetailsModalVisibility: false,
  setStakingPoolModalVisibility: false,
  redeemRewardsModalVisibility: false
}

export const uiState = atom<UiState>({
  key: 'ui-state',
  default: initialState
})

export const setUiState = (state: Partial<UiState>) => {
  setRecoil(uiState, (prev) => ({ ...prev, ...state }))
}
export const toggleDrawer = () => {
  setRecoil(uiState, (prev) => ({ ...prev, drawerIsOpen: !prev.drawerIsOpen }))
}

export const toggleTokenListVisibility = () => {
  const { tokenListVisibility } = getRecoil(uiState)
  setUiState({
    tokenListVisibility: !tokenListVisibility
  })
}

export const toggleRedeemRewardsModalVisibilityVisibility = () => {
  const { redeemRewardsModalVisibility } = getRecoil(uiState)
  setUiState({
    redeemRewardsModalVisibility: !redeemRewardsModalVisibility
  })
}

export const toggleRemoveLiquidityModalVisibility = () => {
  const { removeLiquidityModalVisibility } = getRecoil(uiState)
  setUiState({
    removeLiquidityModalVisibility: !removeLiquidityModalVisibility
  })
}
export const toggleSetStakingPoolModalVisibility = () => {
  const { setStakingPoolModalVisibility } = getRecoil(uiState)
  setUiState({
    setStakingPoolModalVisibility: !setStakingPoolModalVisibility
  })
}

export const toggleConfirmationModalVisibility = () => {
  const { confirmationModalVisibility } = getRecoil(uiState)
  setUiState({
    confirmationModalVisibility: !confirmationModalVisibility
  })
}
export const toggleTradeSettingsModalVisibility = () => {
  const { tradeSettingsVisibility } = getRecoil(uiState)
  setUiState({
    tradeSettingsVisibility: !tradeSettingsVisibility
  })
}
export const toggleAddStakingModalVisibility = () => {
  const { addStakingModalVisibility } = getRecoil(uiState)
  setUiState({
    addStakingModalVisibility: !addStakingModalVisibility
  })
}
export const toggleCreatePositionModalVisibility = () => {
  const { createPositionModalVisibility } = getRecoil(uiState)
  setUiState({
    createPositionModalVisibility: !createPositionModalVisibility
  })
}
export const toggleStakingDetailsModalVisibility = () => {
  const { stakingDetailsModalVisibility } = getRecoil(uiState)
  setUiState({
    stakingDetailsModalVisibility: !stakingDetailsModalVisibility
  })
}
