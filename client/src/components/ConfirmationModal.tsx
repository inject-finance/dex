import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { CancelButton } from '@/components/buttons/CancelButton'
import { loadingState } from '@/features/ui/loading.state'
import {
  toggleConfirmationModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useRecoilValue } from 'recoil'

type Props = {
  children: React.ReactNode
  handleConfirmation: () => void
}

export const ConfirmationModal = dynamic(
  () =>
    Promise.resolve(({ children, handleConfirmation }: Props) => {
      const isLoading = useRecoilValue(loadingState)
      const { confirmationModalVisibility } = useRecoilValue(uiState)

      return (
        <Modal
          isLoading={isLoading}
          open={confirmationModalVisibility}
          title="Transaction Confirmation"
          toggle={toggleConfirmationModalVisibility}
        >
          <div className="flex flex-col items-center justify-center gap-10 pt-10">
            <div>
              <strong>
                <FontAwesomeIcon
                  className="mr-1 text-[var(--light-yellow)]"
                  icon={faCircleExclamation}
                />
                Note:{' '}
              </strong>
              <span>{children}</span>
            </div>
            <div className="flex items-center justify-between w-full gap-5">
              <CancelButton
                className="w-1/2"
                title="Cancel"
                toggle={toggleConfirmationModalVisibility}
              />
              <ActionButton
                className="w-1/2"
                onClick={handleConfirmation}
                title="Confirm"
              />
            </div>
          </div>
        </Modal>
      )
    }),
  { ssr: false }
)
