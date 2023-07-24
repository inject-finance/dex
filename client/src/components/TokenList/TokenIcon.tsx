/* eslint-disable security/detect-non-literal-require */
import { Token } from '@/common/types/Token'
import Image from 'next/image'

import { usePathname } from 'next/navigation'

type Props = {
  token: Token
}

export const TokenIcon = ({ token }: Props) => {
  const pathname = usePathname()

  return (
    <Image
      alt="token_icon"
      className="max-h-[40px] max-w-[40px]"
      height={`${pathname === '/pools' ? 30 : 40}`}
      src={require(`@/assets/images/token-icons/${token.symbol.toLocaleLowerCase()}_icon.png`)}
      width={`${pathname === '/pools' ? 30 : 40}`}
    />
  )
}
