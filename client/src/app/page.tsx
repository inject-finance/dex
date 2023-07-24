import blueGlow from '@/assets/images/blue_glow.png'
import cryptoTokens from '@/assets/images/cryptotokens.svg'
import desktopMockup from '@/assets/images/dexMockupLaptop.png'
import diagonalGlowBlue from '@/assets/images/diagonal_glow_blue.png'
import diagonalGlowYellow from '@/assets/images/diagonal_glow_yellow.png'
import horizontalBlueGlow from '@/assets/images/horizontal_blue_glow.png'
import horizontalYellowGlow from '@/assets/images/horizontal_yellow_glow.png'
import mobileLayout from '@/assets/images/inject_finance_iPhone 12 Pro.png'
import liquidity from '@/assets/images/liquidity.png'
import { ActionButton } from '@/components/buttons/ActionButton'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Home',
  description: 'Landing page'
}

export default function Page() {
  return (
    <main className="max-w-[1024px] mx-auto py-10 md:pt-20 md:pb-10">
      <div className="flex flex-col justify-between w-full gap-10 px-10 md:flex-row lg:gap-0">
        <div className="flex flex-col justify-between w-full min-h-full lg:w-3/5">
          <div className="">
            <h1 className="text-xl md:text-3xl">
              Experience the{' '}
              <span className="text-[var(--light-yellow)]">ultimate</span>{' '}
              trading <span className="text-[var(--light-blue)]">freedom</span>
            </h1>
            <p className="my-5 font-light">
              With fast transaction speeds, low fees, and a user-friendly
              interface, you&apos;ll never want to go back to traditional
              exchanges.
            </p>
          </div>
          <div>
            <Link className="relative z-10 flex" href="/swap">
              <ActionButton className="w-3/4" title="Get Started" />
            </Link>
          </div>
        </div>
        <div className="flex justify-center w-full h-full mx-auto lg:mx-0">
          <div className="flex min-h-[155px] h-[155px] lg:h-[260px] min-w-[300px] max-w-[300px] lg:max-w-[470px] relative">
            <Image
              alt="desktop"
              className="z-50 w-full h-full"
              src={desktopMockup}
            />

            <Image
              alt="blue_glow"
              className="h-[200px] w-[100px] lg:h-[400px] lg:w-[200px] absolute top-0 lg:top-[calc(0%_-_50px)] left-[calc(20%_+_20px)] z-0 animate-[pulse_3s_ease-in-out_infinite]"
              src={diagonalGlowBlue}
            />
            <Image
              alt="yellow_glow"
              className="h-[200px] w-[100px] lg:h-[400px] lg:w-[200px] absolute top-[calc(0%_-_20px)] lg:top-[calc(0%_-_80px)] right-[calc(0%_-_15px)] lg:right-[calc(0%_-_30px)] z-0 animate-[pulse_3s_ease-in-out_infinite]"
              src={diagonalGlowYellow}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-20 mt-12">
        <div className="grid grid-cols-1 gap-10 px-5 md:grid-cols-2 lg:px-10">
          <div className="relative order-last md:order-first ">
            <Image alt="iphone" className="relative z-30" src={mobileLayout} />
            <div className="flex flex-col ">
              <Image
                alt="horizontal yellow glow"
                className="absolute z-0 top-[calc(0%_-_90px)] animate-[pulse_3s_ease-in-out_infinite]"
                src={horizontalYellowGlow}
              />
              <Image
                alt="horizontal blue glow"
                className="absolute z-0 top-[calc(0%_-_-40px)] animate-[pulse_3s_ease-in-out_infinite]"
                src={horizontalBlueGlow}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-[var(--light-blue)]">
              User-Friendly Interface
            </h2>
            <p className="font-barlow opacity-80">
              Inject Finance addresses this issue by providing an intuitive and
              user-friendly interface that simplifies the entire trading
              process. From creating your account to executing trades, the app
              guides you through every step, ensuring a seamless experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 px-5 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-[var(--light-yellow)]">
              Improved Liquidity
            </h2>
            <p className="font-barlow opacity-80">
              We connect users with a wide network of liquidity providers,
              enabling access to a diverse range of trading pools. By tapping
              into multiple liquidity sources, My Dex App ensures competitive
              pricing, minimal slippage, and enhanced trade execution speed.
            </p>
          </div>
          <div className="relative">
            <div className="flex justify-center">
              <Image
                alt="liquidity"
                className="max-w-[250px] max-h-[300px] relative z-30"
                src={liquidity}
              />
            </div>
            <Image
              alt="blue_glow"
              className="h-[500px] w-[400px] absolute z-0 top-[calc(0%_-_80px)] left-[calc(50%_-_110px)] lg:left-[calc(50%_-_130px)] animate-[pulse_3s_ease-in-out_infinite]"
              src={blueGlow}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center p-5 my-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Join the
            <span className="text-[var(--light-yellow)]"> decentralized </span>
            <span className="text-[var(--light-blue)]">revolution</span>
          </h2>
          <p className="my-5 font-barlow">
            Take control of your trading experience with our cutting-edge DEX
            app
          </p>
        </div>
        <div className="flex justify-center w-full">
          <Image
            alt="cryptos"
            className="w-1/2 h-1/2 md:w-1/4 md:h-1/4"
            src={cryptoTokens}
          />
        </div>
      </div>
    </main>
  )
}
