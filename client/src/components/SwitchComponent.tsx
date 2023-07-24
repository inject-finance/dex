'use client'
import blueArrow from '@/assets/images/arrow_blue.png'
import yellowArrow from '@/assets/images/arrow_yellow.png'
import { poolState } from '@/features/pool/pool.state'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import { switchCoins } from '@/features/tokens/utils/switchCoins'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import { useRecoilCallback } from 'recoil'

export const SwitchComponent = dynamic(
  () =>
    Promise.resolve(() => {
      const onClick = useRecoilCallback(({ refresh, snapshot }) => async () => {
        const { tokenA, tokenB } = await snapshot.getPromise(poolState)
        switchCoins()

        refresh(getBalanceSelector(tokenA))
        refresh(getBalanceSelector(tokenB))
      })

      return (
        <button
          className="min-h-[50px] min-w-[50px] max-w-fit self-center p-2 rounded-full transition duration-120 ease-out bg-[var(--bg-black)] tooltip tooltip-up absolute hover:ease-in hover:bg-[#000e00] top-[calc(50%_-_12px)] md:top-[calc(50%_-_26px)] left-[calc(50%_-_26px)] group"
          data-tip="Switch Tokens"
          id="switch-component"
          onClick={onClick}
        >
          <div className="flex flex-row items-center justify-center gap-1">
            <Image
              alt="swap_icon"
              className="transition ease-in-out duration-75 group-hover:translate-y-[-3px]"
              loading="lazy"
              src={yellowArrow}
              style={{ height: '34px', width: '12px' }}
            />
            <Image
              alt="swap_icon"
              className="transition ease-in-out duration-75 group-hover:translate-y-[3px]"
              loading="lazy"
              src={blueArrow}
              style={{ height: '34px', width: '12px' }}
            />
          </div>
        </button>
      )
    }),
  {
    ssr: false,
    loading: () => (
      <div className="absolute top-[calc(50%_-_12px)] md:top-[calc(50%_-_26px)] left-[calc(50%_-_26px)]">
        <Skeleton
          baseColor="#192026"
          highlightColor="#283336"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      </div>
    )
  }
)
