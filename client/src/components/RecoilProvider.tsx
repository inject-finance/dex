'use client'
import { type ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'

interface Props {
  readonly children: ReactNode
}
export const RecoilProvider = ({ children }: Props) => (
  <RecoilRoot>
    <RecoilNexus />
    {children}
  </RecoilRoot>
)
