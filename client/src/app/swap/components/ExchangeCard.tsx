import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'

interface Props {
  title: string
  children: ReactNode
}

export const ExchangeCard = dynamic(
  () =>
    Promise.resolve(({ title, children }: Props) => (
      <div
        className={`flex flex-col items-start justify-between w-full h-auto p-3 rounded bg-grey border-2 bg-[var(--dark-green)] ${
          title.includes('Send') || title.includes('Token A')
            ? 'border-[#339EA8]/20'
            : 'border-[#D9972F]/20'
        } `}
      >
        <h3 className="mb-3 text-sm capitalize opacity-60">{title}</h3>
        <div className="flex flex-col w-full gap-5 md:flex-row">{children}</div>
      </div>
    )),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        baseColor="#192026"
        highlightColor="#283336"
        style={{ width: '100%', minHeight: '130px' }}
      />
    )
  }
)
