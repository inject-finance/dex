'use client'
import { type Token } from '@/common/types/Token'
import { selectToken } from '@/features/tokens/utils/selectToken'
import { recentTokenState } from '@/features/tokens/recentToken.state'
import { toggleTokenListVisibility } from '@/features/ui/ui.state'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValue } from 'recoil'

export const RecentTokens = () => {
  const recentTokens = useRecoilValue(recentTokenState)

  const createHandleClick = (token: Token) => async () => {
    await selectToken(token)
    toggleTokenListVisibility()
  }

  return (
    <div className="max-w-full mb-5">
      <h3 className="mb-3 text-lg font-light opacity-80">
        Recent
        <FontAwesomeIcon
          className="ml-2 opacity-40"
          color="white"
          icon={faClockRotateLeft}
        />
      </h3>
      <ul className="flex flex-row items-center justify-start">
        {recentTokens?.map((e) => (
          <li key={e.id}>
            <button
              className="mx-1 h-auto w-auto min-w-[70px] text-white text-center bg-[var(--grey)] px-3 py-2 rounded opacity-60 hover:opacity-90"
              onClick={createHandleClick(e)}
            >
              {e.symbol}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
