'use client'
import { useRecoilValue } from 'recoil'
import { SpinnerContainer } from './SpinnerContainer'
import { loadingState } from '@/features/ui/loading.state'

interface Props {
  readonly open: boolean
  readonly toggle: () => void
  readonly title: string
  readonly children: React.ReactNode
  readonly OpenButton?: React.ReactElement
}
export const Modal = ({ open, toggle, title, children, OpenButton }: Props) => {
  const loading = useRecoilValue(loadingState)

  return (
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
            isLoading={Boolean(loading?.status)}
            text={loading?.text}
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

        {Boolean(!loading) && (
          <label className="modal-backdrop" onClick={toggle}>
            Cancel
          </label>
        )}
      </div>
    </>
  )
}
