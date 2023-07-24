import poolsIcon from '@/assets/images/pools_menu_icon.png'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
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
          <button className="group min-w-[32px]">
            <Link className="w-full h-full" href="/create-new-pool">
              <div
                className="flex flex-row items-center justify-center py-1 px-2 w-full text-md rounded-full opacity-60 bg-gradient-to-br from-[var(--light-blue)] to-[var(--brand-yellow)] hover:opacity-100"
                id="createBtn"
              >
                <FontAwesomeIcon
                  className="max-h-[18px] max-w-[18px] transition ease-in-out duration-500 group-hover:rotate-90"
                  icon={faPlus}
                />
                <span className="flex gap-1">
                  <p />
                  Create New Pool
                </span>
              </div>
            </Link>
          </button>
        </div>
        <Header />
        <PoolTable />
      </div>
    </main>
  )
}
