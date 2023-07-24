import { getProvider } from './getProvider'

export const getSigner = () => {
  const provider = getProvider()

  if (!provider)
    throw new Error('Please make sure you have metamask installed.')

  return provider.getSigner()
}
