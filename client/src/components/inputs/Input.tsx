import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  readonly icon: IconProp
  readonly Right?: React.ReactElement
  readonly register?: UseFormRegisterReturn<string>
  readonly labelText?: string
  readonly errorText?: string
}
export const Input = ({
  type,
  icon,
  placeholder,
  Right,
  register,
  labelText,
  errorText,
  ...props
}: Props) => (
  <div className="w-full form-control">
    {Boolean(labelText) && (
      <label className="label">
        <span className="label-text">{labelText}</span>
      </label>
    )}
    <div className="group flex justify-start items-center w-full rounded bg-[var(--green-black)] px-3 opacity-80 tooltip tooltip-right ease-in-out duration-300 border border-1 border-[#d9d9d9]/20 focus-within:border-[#339ea8]/50">
      <FontAwesomeIcon
        className="opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
        color="#339EA8"
        icon={icon}
      />
      <input
        className="w-full pr-2 bg-transparent border-none input focus:outline-none placeholder:opacity-60 placeholder:text-left disabled:bg-transparen"
        placeholder={placeholder}
        type={type}
        {...props}
        {...register}
      />
      {Right}
    </div>
    {Boolean(errorText) && (
      <label className="label">
        <span className="label-text-alt">{errorText}</span>
      </label>
    )}
  </div>
)
