import createMenuIcon from '@/assets/images/create_pair_menu_icon.png'
import liquidityMenuIcon from '@/assets/images/liquidity_icon.png'
import swapMenuIcon from '@/assets/images/swap_icon_title.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { TradeSettings } from '../TradeSettings'

export const GlowComponentHeader = () => {
  const pathname = usePathname()

  return (
    <div className="flex flex-row items-start justify-between w-full">
      <h2 className="flex flex-row items-center gap-3 text-2xl font-semibold">
        {pathname === '/swap' && (
          <>
            Swap
            <Image
              alt="liquidity_icon"
              className="h-[22px] w-[22px]"
              src={swapMenuIcon}
            />
          </>
        )}

        {pathname === '/liquidity' && (
          <>
            Add Liquidity
            <Image
              alt="liquidity_icon"
              className="h-[22px] w-[22px]"
              src={liquidityMenuIcon}
            />
          </>
        )}

        {pathname === '/create-new-pool' && (
          <>
            Create New Pool
            <Image
              alt="liquidity_icon"
              className="h-[22px] w-[22px]"
              src={createMenuIcon}
            />
          </>
        )}
      </h2>
      <div className="flex flex-row items-center justify-end gap-1">
        {pathname === '/swap' && <TradeSettings />}
      </div>
    </div>
  )
}
