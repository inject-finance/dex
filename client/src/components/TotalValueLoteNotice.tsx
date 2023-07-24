'use client'
import { poolState } from '@/features/pool/pool.state'
import { getTotalValueLote } from '@/features/pool/selectors/getTotalValueLote'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

export const TotalValueLoteNotice = () => {
  const { tokenA, tokenB } = useRecoilValue(poolState)
  const { state, contents } = useRecoilValueLoadable(
    getTotalValueLote({ tokenA, tokenB })
  )

  if (state === 'hasError') {
    return <span>{JSON.stringify(contents)} USD</span>
  }

  if (state === 'hasValue') {
    return <span className="opacity-80">{contents.toFixed(2)} USD</span>
  }

  return <>Loading...</>
}
