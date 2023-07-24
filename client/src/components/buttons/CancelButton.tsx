import { usePathname } from 'next/navigation'

type Props = {
  readonly className?: string
  readonly title: string
  readonly toggle: () => void
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const CancelButton = ({ className, title, toggle, ...props }: Props) => {
  const pathname = usePathname()

  return (
    <button
      className={`flex justify-center items-center h-[30px] rounded py-2 px-5 bg-[var(--grey)] opacity-60 hover:opacity-100 transition ease-in-out duration-300 ${className} whitespace-nowrap`}
      data-tip={pathname === '/pools' ? 'Remove Shares/Liquidity' : ''}
      onClick={toggle}
      {...props}
    >
      {title}
    </button>
  )
}
