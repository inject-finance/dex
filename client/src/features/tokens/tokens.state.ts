import { type Token } from '@/common/types/Token'
import {
  ARBContractAddress,
  BATContractAddress,
  DAIContractAddress,
  INJ3ContractAddress,
  LINKContractAddress,
  USDCContractAddress,
  WETHContractAddress
} from '@/contracts/data/TokenAddresses'

export const TOKENS: Token[] = [
  {
    id: '1',
    name: 'WETH',
    symbol: 'WETH',
    address: WETHContractAddress,
    amount: ''
  },
  {
    id: '2',
    name: 'DAI',
    symbol: 'DAI',
    address: DAIContractAddress,
    amount: ''
  },
  {
    id: '3',
    name: 'ETH',
    symbol: 'ETH',
    address: WETHContractAddress,
    amount: ''
  },
  {
    id: '4',
    name: 'LINK',
    symbol: 'LINK',
    address: LINKContractAddress,
    amount: ''
  },
  {
    id: '5',
    name: 'BAT',
    symbol: 'BAT',
    address: BATContractAddress,
    amount: ''
  },
  {
    id: '6',
    name: 'ARB',
    symbol: 'ARB',
    address: ARBContractAddress,
    amount: ''
  },
  {
    id: '7',
    name: 'USDC',
    symbol: 'USDC',
    address: USDCContractAddress,
    amount: ''
  },
  {
    id: '8',
    name: 'INJ3',
    symbol: 'INJ3',
    address: INJ3ContractAddress,
    amount: ''
  }
]
