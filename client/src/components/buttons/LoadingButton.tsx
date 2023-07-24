'use client'
import { Spinner } from '@/components/Spinner'

export const LoadingButton = () => (
  <span className="btn-disabled opacity-40 flex justify-center items-center w-full rounded py-2 text-white bg-gradient-to-br from-[var(--light-blue)] to-[var(--brand-yellow)]">
    <Spinner />
  </span>
)
