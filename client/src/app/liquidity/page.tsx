import { Metadata } from 'next'
import { LiquidityContainer } from './components/LiquidityContainer'

export const metadata: Metadata = {
  title: 'Liquidity'
}

export default function Page() {
  return <LiquidityContainer />
}
