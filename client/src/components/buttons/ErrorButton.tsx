type Props = {
  readonly text: string
}
export const ErrorButton = ({ text }: Props) => (
  <span className="px-4 text-center btn-disabled opacity-40 flex justify-center items-center w-full rounded py-2 text-white bg-gradient-to-br from-[var(--light-blue)] to-[var(--brand-yellow)]">
    {text}
  </span>
)
