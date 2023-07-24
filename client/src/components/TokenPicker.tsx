'use client'
import { type Token } from '@/common/types/Token'
import { setSelectedTokenState } from '@/features/tokens/selectedToken.state'
import { toggleTokenListVisibility } from '@/features/ui/ui.state'
import { useRecoilCallback } from 'recoil'

type Props = {
  token: Token
}

export const TokenPicker: React.FC<Props> = ({ token }) => {
  const toggleVisible = useRecoilCallback(() => () => {
    setSelectedTokenState(token)
    toggleTokenListVisibility()
  })

  return (
    <div className="w-full">
      <div className="flex flex-col items-start justify-start w-ful">
        <button
          className="justify-start w-full px-5 rounded btn border-none bg-[var(--green-black)] hover:bg-[var(--green-black)] group"
          onClick={toggleVisible}
        >
          <span className="text-[var(--white)] opacity-60 group-hover:opacity-90 transition ease-in-out duration-300">
            {token.symbol || 'Choose Crypto'}
          </span>
        </button>
        <span className="px-5 py-2 opacity-40">
          {token.name || 'Choose Crypto'}
        </span>
      </div>
    </div>
  )
}
