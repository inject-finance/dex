import createPairMenuIcon from '@/assets/images/create_pair_menu_icon.png'
import logo from '@/assets/images/inject_finance_logo.png'
import liquidityMenuIcon from '@/assets/images/liquidity_icon.png'
import poolsMenuIcon from '@/assets/images/pools_menu_icon.png'
import swapMenuIcon from '@/assets/images/swap_icon_title.png'
import { authState } from '@/features/auth/auth.state'
import { toggleDrawer, uiState } from '@/features/ui/ui.state'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import ReactDrawer from 'react-modern-drawer'
import { useRecoilValue } from 'recoil'

export const Drawer = dynamic(
  () =>
    Promise.resolve(() => {
      const { drawerIsOpen } = useRecoilValue(uiState)
      const { account } = useRecoilValue(authState)

      return (
        <ReactDrawer
          className="flex flex-col gap-3"
          direction="left"
          onClose={toggleDrawer}
          open={drawerIsOpen}
        >
          <div className="text-center">
            <Link
              className="self-start h-auto mx-auto text-xl normal-case btn btn-ghost hover:bg-transparent"
              href="/"
            >
              <Image
                alt="Inject finance Logo"
                className="h-[80px] w-[55px]"
                src={logo}
              />
            </Link>
          </div>
          {/* TRADE CONTENT */}
          <div className="rounded dropdown dropdown-right">
            <span
              className="py-2 px-5 active:bg-[var(--brand-blue)] flex items-center gap-2 font-tomorrow rounded hover:cursor-pointer opacity-60 hover:opacity-100 transition ease-in-out duration-300"
              tabIndex={0}
            >
              Trade
              <span className="text-xs min-w-[12px]">
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            </span>
            <ul
              className="p-2 rounded shadow dropdown-content menu bg-[var(--brand-blue)] w-52 [&>li>a:hover]:text-[var(--white)] [&>li>a:hover]:opacity-60 [&>li>a:focus]:text-[var(--white)"
              tabIndex={0}
            >
              <li>
                <Link className="active:bg-[var(--brand-blue)]" href="/swap">
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
                  className="active:bg-[var(--brand-blue)]"
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
                    className="active:bg-[var(--brand-blue)]"
                    href="/create-new-pool"
                  >
                    Create New Pool
                    <Image
                      alt="liquidity_icon"
                      className="h-[18px] w-[18px]"
                      src={createPairMenuIcon}
                    />
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {/* EARN CONTENT */}
          <div className="rounded dropdown dropdown-right">
            <span
              className="py-2 px-5 active:bg-[var(--brand-blue)] flex items-center gap-2 font-barlow rounded hover:cursor-pointer opacity-60 hover:opacity-100 transition ease-in-out duration-300"
              tabIndex={0}
            >
              Earn
              <span className="text-xs min-w-[12px]">
                <FontAwesomeIcon icon={faChevronRight} />
              </span>
            </span>
            <ul
              className="p-2 rounded shadow dropdown-content menu bg-[var(--brand-blue)] w-52 [&>li>a:hover]:text-[var(--white)] [&>li>a:hover]:opacity-60 [&>li>a:focus]:text-[var(--white)"
              tabIndex={0}
            >
              {/* <li>
                <Link className="active:bg-[var(--brand-blue)]" href="/">
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
                  className="flex flex-row items-center active:bg-[var(--brand-blue)]"
                  href="/pools"
                >
                  Pools
                  <Image
                    alt="liquidity_icon"
                    className="h-[18px] w-[20px]"
                    src={poolsMenuIcon}
                    style={{ height: 'auto', width: 'auto' }}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </ReactDrawer>
      )
    }),
  {
    ssr: false
  }
)
