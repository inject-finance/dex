'use client'
import positionsMenuIcon from '@/assets/images/positions_menu_icon.png'
import Image from 'next/image'
import { CreatePositionModal } from './CreatePositionModal/CreatePositionModal'
import { OpenModalButton } from './CreatePositionModal/OpenModalButton'

export const Header = () => (
  <div className="flex flex-row justify-between">
    <h2 className="flex flex-row items-center gap-3 text-2xl font-semibold">
      Positions
      <Image
        alt="liquidity_icon"
        className="h-[18px] w-[22px]"
        src={positionsMenuIcon}
      />
    </h2>
    <OpenModalButton />
    <CreatePositionModal />
  </div>
)
