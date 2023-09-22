/* eslint-disable no-use-before-define */
'use client'
import { Token } from '@/common/types/Token'
import { SearchBar } from '@/components/SearchBar'
import { Spinner } from '@/components/Spinner'
import { toggleTokenListVisibility, uiState } from '@/features/ui/ui.state'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import {
  RecoilValueReadOnly,
  useRecoilValue,
  useRecoilValueLoadable
} from 'recoil'
import { Modal } from '../Modal'
import { TokenCard } from './TokenCard'

interface Props {
  readonly selector: RecoilValueReadOnly<{
    tokens: Token[]
    tokenThatNeedMatch: Token
  }>
}

export const TokenList = dynamic(
  () =>
    Promise.resolve(({ selector }: Props) => {
      const { tokenListVisibility } = useRecoilValue(uiState)

      return (
        <Modal
          open={tokenListVisibility}
          title="Cryptocurrencies"
          toggle={toggleTokenListVisibility}
        >
          <div className="min-h-[400px] h-auto max-h-[700px] w-full">
            <div className="flex flex-col justify-between mb-3 text-lg font-semibold xl:text-xl">
              <div className="mt-5">
                <SearchBar />
              </div>
              {Boolean(tokenListVisibility) && (
                <RenderTokenList selector={selector} />
              )}
            </div>
          </div>
        </Modal>
      )
    }),
  { ssr: false }
)

const RenderTokenList = ({ selector }: Props) => {
  const { state, contents } = useRecoilValueLoadable(selector)

  if (state === 'loading' || state !== 'hasValue') {
    return (
      <ul className="max-h-[280px] overflow-y-hidden flex justify-center">
        <Spinner />
      </ul>
    )
  }

  if (!contents.tokens.length) {
    return (
      <span className="flex flex-col gap-2 py-5 text-center opacity-60">
        <FontAwesomeIcon
          className="text-[var(--light-yellow)]"
          icon={faExclamationCircle}
        />
        {contents.tokenThatNeedMatch.symbol} does not exist in any pool yet
      </span>
    )
  }

  return (
    <ul className="max-h-[280px] overflow-y-scroll">
      {contents.tokens.map((token) => (
        <li className="mb-3" key={token.id}>
          <TokenCard token={token} />
        </li>
      ))}
    </ul>
  )
}
