import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  readonly title: string
  readonly icon?: IconProp
}

export const ActionButton = ({ className, title, icon, ...props }: Props) => (
  <button
    className={`flex justify-center items-center h-[30px] rounded py-2 px-5 bg-gradient-to-br from-[var(--light-blue)] to-[var(--brand-yellow)] bg-transparent transition ease-in-out duration-300 hover:opacity-80 whitespace-nowrap ${className} tooltip tooltip-top`}
    data-tip={title}
    {...props}
  >
    {title}
    {icon ? <FontAwesomeIcon className="pl-[5px]" icon={icon} /> : null}
  </button>
)
