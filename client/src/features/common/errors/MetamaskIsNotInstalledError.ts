import { createErrorFactory } from './createErrorFactory'

export const MetamaskError = createErrorFactory('MetamaskIsNotInstalledError')

export const MetamaskIsNotInstalledError = new MetamaskError(
  'MetamaskIsNotInstalledError'
)
