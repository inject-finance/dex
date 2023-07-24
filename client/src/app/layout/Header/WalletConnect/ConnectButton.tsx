import { ActionButton } from '@/components/buttons/ActionButton'
import { connect } from '@/features/auth/actions/connect.action'
import { signIn } from '@/features/auth/actions/signIn.action'
import { useMetamask } from '@/features/auth/hooks/useMetamask'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export const ConnectButton = () => {
  useMetamask()

  const sign = () => {
    connect().then(signIn)
  }

  return (
    <ActionButton
      className="w-[120px] max-w-[120px]"
      icon={faUser}
      onClick={sign}
      title="Connect"
    />
  )
}
