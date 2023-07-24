'use client'
import { Modal } from '@/components/Modal'
import { poolState } from '@/features/pool/pool.state'
import { loadingState } from '@/features/ui/loading.state'
import {
  toggleCreatePositionModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import { usePathname } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { Footer } from './Footer'
import { PoolSelectorSection } from './PoolSelectorSection'
import { SharesSection } from './SharesSection'
import { TimeSpanSection } from './TimeSpanSection'

export const CreatePositionModal = () => {
  const { createPositionModalVisibility } = useRecoilValue(uiState)
  const { tokenA, tokenB } = useRecoilValue(poolState)
  const isLoading = useRecoilValue(loadingState)
  const pathname = usePathname()

  return (
    <Modal
      isLoading={isLoading}
      open={createPositionModalVisibility}
      title={`Create Position in ${tokenA.symbol} / ${tokenB.symbol}`}
      toggle={toggleCreatePositionModalVisibility}
    >
      <div className="flex flex-col gap-2 py-3">
        {pathname === '/positions' && <PoolSelectorSection />}

        <TimeSpanSection />

        <SharesSection />

        <Footer />
      </div>
    </Modal>
  )
}
