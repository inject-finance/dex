import poolsIcon from '@/assets/images/pools_menu_icon.png'
import Image from 'next/image'
import { CreateNewPoolButton } from './components/CreateNewPoolButton'
import { Header } from './components/Header'
import { PoolTable } from './components/PoolTable'

export const metadata = {
  title: 'Pools',
  description: 'Landing page'
}

export default function Page() {
  return (
    <main className="max-w-[1024px] m-auto relative">
      <div className="flex flex-col gap-5 min-h-[520px] max-h-[520px] w-[380px] md:w-[560px] lg:w-[840px] p-5 rounded bg-[var(--green-black)] overflow-y-auto overflow-x-hidden">
        <div className="flex flex-row justify-between">
          <h2 className="flex flex-row items-center gap-3 text-2xl font-semibold">
            Pools
            <Image
              alt="liquidity_icon"
              className="h-[18px] w-[22px]"
              src={poolsIcon}
            />
          </h2>

          <CreateNewPoolButton />
        </div>
        <Header />
        <PoolTable />
      </div>
    </main>
  )
}
