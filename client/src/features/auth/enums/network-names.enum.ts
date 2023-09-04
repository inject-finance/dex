export const enum NetworkNames {
  MAINNET = 'homestead',
  ARBITRUM_GOERLI = 'arbitrum-goerli',
  ARBITRUM = 'arbitrum',
  LOCALHOST = 'unknown'
}

export const NetworkNamesBeauty: Record<string, string> = {
  homestead: 'MAINNET',
  'arbitrum-goerli': 'ARBITRUM GOERLI',
  arbitrum: 'ARBITRUM',
  unknown: 'unknown'
}
