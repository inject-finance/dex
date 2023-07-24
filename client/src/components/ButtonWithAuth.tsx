/* eslint-disable react/display-name */
import { authState } from '@/features/auth/auth.state'
import { getRecoil } from 'recoil-nexus'

export const buttonWithAuth =
  <P extends React.JSX.IntrinsicAttributes>(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> =>
  (props: P) => {
    const { isAuthenticated } = getRecoil(authState)
    if (!isAuthenticated) {
      // Return a "Not Connected" button if the user is not authenticated
      return (
        <button className="flex w-full justify-center items-center gap-3 p-3 mt-3 capitalize text-lg opacity-40 bg-[var(--grey)] trasition duration-300 ease-in-out rounded hover:opacity-60">
          Not Connected
        </button>
      )
    }

    // Render the wrapped component if the user is authenticated
    return <WrappedComponent {...props} />
  }
