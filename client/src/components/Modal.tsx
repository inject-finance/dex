'use client'
import { SpinnerContainer } from './SpinnerContainer'

export const Modal: React.FC<{
  open: boolean
  toggle: () => void
  title: string
  children: React.ReactNode
  OpenButton?: React.ReactElement
  isLoading?: { status: boolean; text: string }
}> = ({ open, toggle, title, children, OpenButton, isLoading }) => (
  <>
    {Boolean(OpenButton) && OpenButton}
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div
        className="modal-box rounded border-1 h-auto w-4/5 bg-[var(--green-black)] lg:w-[480px] p-0 overflow-y-hidden"
        style={{
          borderStyle: 'solid',
          borderWidth: '1px',
          borderImage: 'linear-gradient(120deg, #339EA8, #D9972F) 1 round',
          borderRadius: '10px'
        }}
      >
        <SpinnerContainer
          isLoading={Boolean(isLoading?.status)}
          text={isLoading?.text}
        >
          <div className="p-5">
            <div className="flex flex-row justify-between text-lg font-semibold xl:text-xl">
              <h2>{title}</h2>
              <label
                className="btn btn-sm btn-circle text-white font-lig bg-transparent border-none hover:bg-[var(--bg-black)]"
                onClick={toggle}
              >
                ✕
              </label>
            </div>
            {children}
          </div>
        </SpinnerContainer>
      </div>

      {Boolean(!isLoading) && (
        <label className="modal-backdrop" onClick={toggle}>
          Cancel
        </label>
      )}
    </div>
  </>
)
