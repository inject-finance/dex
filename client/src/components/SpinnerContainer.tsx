import React from 'react'
import { Spinner } from './Spinner'

type Props = {
  children: React.ReactNode
  isLoading: boolean
  style?: any
  text?: string
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
