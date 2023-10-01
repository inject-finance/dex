/* eslint-disable security/detect-non-literal-require */
import { Token } from '@/common/types/Token'
import Image from 'next/image'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  readonly token: Token
}

export const TokenIcon = ({ token }: Props) => {
  const [imgSrc, setImgSrc] = useState(
    `/images/token-icons/${token.symbol.toLocaleLowerCase()}_icon.png`
  )

  const pathname = usePathname()

  return (
    <Image
      alt="token_icon"
      className="max-h-[40px] max-w-[40px]"
      height={pathname === '/pools' ? 30 : 40}
      onError={() => {
        setImgSrc('/images/token-icons/token_placeholder.png')
      }}
      src={imgSrc}
      width={pathname === '/pools' ? 30 : 40}
    />
  )
}
