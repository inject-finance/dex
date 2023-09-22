import dynamic from 'next/dynamic'

interface Props {
  poolAddress?: string
}
export const PoolAddressNotice = dynamic(
  () =>
    Promise.resolve(({ poolAddress }: Props) => (
      <div className="mt-2 ml-2 opacity-50">
        <h3 className="text-sm">Pool Address:</h3>
        <span className="opacity-60">{poolAddress}</span>
      </div>
    )),
  { ssr: false }
)
