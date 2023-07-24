import { Input } from '@/components/inputs/Input'
import { setSwapState, swapState } from '@/features/swap/swap.state'
import {
  toggleTradeSettingsModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import {
  faExclamationCircle,
  faGear,
  faPercent
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { Modal } from './Modal'

export const TradeSettings = () => {
  const { slippage } = useRecoilValue(swapState)
  const { tradeSettingsVisibility } = useRecoilValue(uiState)

  const handleSlippageInput = ({
    currentTarget
  }: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(currentTarget.value))) {
      return
    }

    if (Number(currentTarget.value) > 10) {
      setSwapState({ slippage: 10 })
    }

    if (
      Number(currentTarget.value) >= -1 &&
      Number(currentTarget.value) <= 10
    ) {
      setSwapState({ slippage: currentTarget.value })
    }
  }

  return (
    <div>
      <Modal
        OpenButton={
          <button
            className="group flex items-center justify-center h-[30px] w-[30px] p-1 text-lg rounded-full transition duration-120 ease-out opacity-60 hover:ease-in hover:opacity-90 hover:bg-[var(--bg-black)] tooltip tooltip-top"
            data-tip="Swap Settings"
            onClick={toggleTradeSettingsModalVisibility}
          >
            <FontAwesomeIcon
              className="max-h-[18px] max-w-[18px] transition ease-in-out duration-300 group-hover:rotate-180"
              icon={faGear}
            />
          </button>
        }
        open={tradeSettingsVisibility}
        title="Trade Settings"
        toggle={toggleTradeSettingsModalVisibility}
      >
        <div className="flex flex-col gap-5 py-5">
          <h2>Slippage</h2>
          <Input
            icon={faPercent}
            onChange={handleSlippageInput}
            placeholder="Slippage"
            value={String(slippage || '')}
          />
          <span className="text-xs opacity-60">
            <FontAwesomeIcon
              className="text-[var(--light-yellow)]"
              icon={faExclamationCircle}
            />
            <strong> Note: </strong>
            <span className="text-[var(--light-blue)]">Slippage </span>
            represents a received{' '}
            <span className="text-[var(--light-yellow)]">amount bandwith</span>.
            The amount you will receive could be the{' '}
            <span className="text-[var(--light-blue)]">slippage </span>
            percentage up or down (max 10%).
          </span>
        </div>
      </Modal>
    </div>
  )
}
