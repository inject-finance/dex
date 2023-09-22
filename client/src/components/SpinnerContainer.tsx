import React from 'react'
import { Spinner } from './Spinner'

interface Props {
  readonly children: React.ReactNode
  readonly isLoading: boolean
  readonly style?: any
  readonly text?: string
}
export const SpinnerContainer = ({
  children,
  isLoading,
  style,
  text
}: Props) => (
  <div className="relative" style={style}>
    {children}
    {isLoading ? (
      <div className="absolute min-w-full min-h-full bg-[#091316]/80 top-0 z-50 flex justify-center items-center text-xl font-light">
        <Spinner text={text} />
      </div>
    ) : null}
  </div>
)
