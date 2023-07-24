'use client'
import { type ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'

type Props = {
  children: ReactNode
}
export const RecoilProvider: React.FC<Props> = ({ children }) => (
  <RecoilRoot>
    <RecoilNexus />
    {children}
  </RecoilRoot>
)
