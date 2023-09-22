import { type Token } from '@/common/types/Token'
import { poolState } from '@/features/pool/pool.state'
import { pushRecentToken } from '@/features/tokens/recentToken.state'
import { selectedTokenState } from '@/features/tokens/selectedToken.state'
import { getPriceSelector } from '@/features/tokens/selectors/getPrice.selector'
import { selectToken } from '@/features/tokens/utils/selectToken'
import { toggleTokenListVisibility } from '@/features/ui/ui.state'
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable
} from 'recoil'
import { TokenIcon } from './TokenIcon'

interface Props {
  readonly token: Token
}

export const TokenCard = ({ token }: Props) => {
  const { tokenA } = useRecoilValue(poolState)
  const selectedToken = useRecoilValue(selectedTokenState)
  const { state: priceState, contents: price } = useRecoilValueLoadable(
    getPriceSelector(token)
  )

  const handleOptionClick = useRecoilCallback(
    ({ refresh }) =>
      (currentToken: Token) =>
      () => {
        selectToken(currentToken)
        pushRecentToken(currentToken)
        toggleTokenListVisibility()

        refresh(poolState)
      }
  )
  return (
    <div className="pr-2">
      <button
        className={`p-2 text-xl rounded-md transition duration-120 ease-out opacity-60 hover:ease-in hover:opacity-90 hover:bg-[var(--grey)] w-full border border-1 ${
          selectedToken.symbol === tokenA.symbol
            ? 'border-[#339EA8]/40'
            : 'border-[#D9972F]/40'
        }`}
        onClick={handleOptionClick(token)}
      >
        <label className="flex flex-row items-center justify-between w-full gap-3 cursor-pointer">
          <div className="flex items-center gap-2">
            <TokenIcon token={token} />
            <div className="flex flex-col items-start justify-end">
              <div className="flex gap-2">
                <span className="">{token.symbol}</span>
              </div>
              <span className="text-sm opacity-60">USD</span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-end">
            <span>1</span>
            <span className="text-sm opacity-60">
              {priceState === 'hasValue' && `${Number(price).toFixed(2)}`}
            </span>
          </div>
        </label>
      </button>
    </div>
  )
}
