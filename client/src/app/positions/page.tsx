import { Header } from './components/Header'
import { PositionsContainer } from './components/PositionsContainer'

export const metadata = {
  title: 'Positions',
  description: ''
}

export default function Page() {
  return (
    <main className="max-w-[1024px] m-auto relative">
      <div className="flex flex-col gap-5 min-h-[520px] max-h-[520px] w-[320px] md:w-[520px] lg:w-[840px] p-5 rounded bg-[var(--green-black)] overflow-y-auto overflow-x-hidden">
        <Header />
        <PositionsContainer />
      </div>
    </main>
  )
}
