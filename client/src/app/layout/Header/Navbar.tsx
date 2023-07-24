'use client'
import createPairMenuIcon from '@/assets/images/create_pair_menu_icon.png'
import logo from '@/assets/images/inject_finance_logo.png'
import liquidityMenuIcon from '@/assets/images/liquidity_icon.png'
import poolsMenuIcon from '@/assets/images/pools_menu_icon.png'
import swapMenuIcon from '@/assets/images/swap_icon_title.png'
import { authState } from '@/features/auth/auth.state'
import { toggleDrawer } from '@/features/ui/ui.state'
import {
  faChevronDown,
  faCircleCheck,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { WalletConnect } from './WalletConnect/WalletConnect'

export const Navbar = () => {
  const { isAuthenticated, account } = useRecoilValue(authState)
  const pathname = usePathname()
  return (
    <div className="navbar bg-[var(--bg-black)] max-w-[1024px] mx-auto px-5 lg:px-10 relative z-30 sm:px-10">
      <div className="flex-none lg:hidden">
        <label className="btn btn-square btn-ghost" onClick={toggleDrawer}>
          <FontAwesomeIcon
            className="max-h-[18px]"
            icon={faEllipsisVertical}
            size="lg"
          />
        </label>
      </div>

      <div className="flex flex-row w-full gap-5">
        <Link
          className="p-0 text-xl normal-case btn btn-ghost hover:bg-transparent"
          href="/"
        >
          <Image
            alt="Dex Logo"
            className="h-[60px] w-[40px] lg:h-[80px] lg:w-[55px]"
            src={logo}
          />
        </Link>
        <div className="flex flex-col w-full h-[60px] justify-between relative z-10">
          <div className="flex flex-row items-center justify-end h-full lg:justify-between">
            <div className="z-50 hidden lg:inline-block drop-shadow-xl">
              <div className="flex">
                {/* TRADE CONTENT */}
                <div className="rounded dropdown">
                  <span
                    className="p-2 active:bg-[var(--brand-blue)] flex items-center gap-2 font-tomorrow rounded hover:cursor-pointer opacity-60 hover:opacity-100 transition ease-in-out duration-300"
                    tabIndex={0}
                  >
                    Trade
                    <span className="text-xs min-w-[12px]">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                  </span>
                  <ul
                    className="p-2 rounded shadow dropdown-content menu bg-[var(--brand-blue)] w-52 [&>li>a:hover]:text-[var(--white)] [&>li>a:hover]:opacity-60 [&>li>a:focus]:text-[var(--white)]"
                    tabIndex={0}
                  >
                    <li>
                      <Link
                        className="active:bg-[var(--brand-blue)] rounded hover:cursor-pointer"
                        href="/swap"
                      >
                        Swap
                        <Image
                          alt="swap_icon"
                          className="h-[18px] w-[18px]"
                          src={swapMenuIcon}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="active:bg-[var(--brand-blue)] rounded hover:cursor-pointer"
                        href="/liquidity"
                      >
                        Liquidity
                        <Image
                          alt="liquidity_icon"
                          className="h-[18px] w-[18px]"
                          src={liquidityMenuIcon}
                        />
                      </Link>
                    </li>

                    {account.address ===
                      process.env.NEXT_PUBLIC_ADDRESS_STAKING_OWNER?.toLocaleLowerCase() && (
                      <li>
                        <Link
                          className="active:bg-[var(--brand-blue)] rounded hover:cursor-pointer"
                          href="/create-new-pool"
                        >
                          Create New Pool
                          <Image
                            alt="create_icon"
                            className="h-[18px] w-[18px]"
                            src={createPairMenuIcon}
                          />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                {/* EARN CONTENT */}
                <div className="dropdown">
                  <span
                    className="p-2 active:bg-[var(--brand-blue)] flex items-center gap-2 font-barlow rounded hover:cursor-pointer opacity-60 hover:opacity-100 transition ease-in-out duration-300"
                    tabIndex={0}
                  >
                    Earn
                    <span className="text-xs min-w-[12px]">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                  </span>
                  <ul
                    className="p-2 rounded shadow dropdown-content menu bg-[var(--brand-blue)] w-52 [&>li>a:hover]:text-[var(--white)] [&>li>a:hover]:opacity-60 [&>li>a:focus]:text-[var(--white)"
                    tabIndex={0}
                  >
                    {/* <li>
                      <Link
                        className="active:bg-[var(--brand-blue)] rounded hover:cursor-pointer"
                        href="/positions"
                      >
                        Positions
                        <Image
                          alt="liquidity_icon"
                          className="h-[18px] w-[18px]"
                          src={positionsMenuIcon}
                        />
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        className="flex flex-row items-center active:bg-[var(--brand-blue)] rounded hover:cursor-pointer"
                        href="/pools"
                      >
                        Pools
                        <Image
                          alt="liquidity_icon"
                          className="h-[18px] w-[20px]"
                          src={poolsMenuIcon}
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full h-[30px] gap-5">
              {pathname !== '/' ? (
                <>
                  {isAuthenticated ? (
                    <span className="flex flex-row items-center gap-1 h-auto p-0 min-h-[30px] group rounded py-1 px-5 truncate text-sm max-w-[170px] bg-[var(--green-black)] transition duration-300 ease-in-out opacity-40 group-hover:opacity-100">
                      synced
                      <FontAwesomeIcon
                        className="text-green-600"
                        icon={faCircleCheck}
                      />
                    </span>
                  ) : null}

                  <WalletConnect />
                </>
              ) : null}
            </div>
          </div>

          <div className="hidden lg:block h-[1px] w-full mx-auto bg-gradient-to-r from-[var(--light-blue)] to-[var(--light-yellow)] opacity-60" />
        </div>
      </div>
    </div>
  )
}
