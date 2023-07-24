/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils
} from 'ethers'
import type {
  FunctionFragment,
  Result,
  EventFragment
} from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue
} from './common'

export interface PoolFactoryInterface extends utils.Interface {
  functions: {
    'addToWhitelist(address[])': FunctionFragment
    'allPairs(uint256)': FunctionFragment
    'allPairsLength()': FunctionFragment
    'createPair(address,address,uint256)': FunctionFragment
    'getPairAddress(address,address)': FunctionFragment
    'owner()': FunctionFragment
    'pairExists(address,address)': FunctionFragment
    'pause()': FunctionFragment
    'paused()': FunctionFragment
    'removeFromWhitelist(address[])': FunctionFragment
    'renounceOwnership()': FunctionFragment
    'transferOwnership(address)': FunctionFragment
    'unpause()': FunctionFragment
    'whitelist(address)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'addToWhitelist'
      | 'allPairs'
      | 'allPairsLength'
      | 'createPair'
      | 'getPairAddress'
      | 'owner'
      | 'pairExists'
      | 'pause'
      | 'paused'
      | 'removeFromWhitelist'
      | 'renounceOwnership'
      | 'transferOwnership'
      | 'unpause'
      | 'whitelist'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'addToWhitelist',
    values: [PromiseOrValue<string>[]]
  ): string
  encodeFunctionData(
    functionFragment: 'allPairs',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'allPairsLength',
    values?: undefined
  ): string
  encodeFunctionData(
    functionFragment: 'createPair',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'getPairAddress',
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'pairExists',
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'removeFromWhitelist',
    values: [PromiseOrValue<string>[]]
  ): string
  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined
  ): string
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [PromiseOrValue<string>]
  ): string
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'whitelist',
    values: [PromiseOrValue<string>]
  ): string

  decodeFunctionResult(
    functionFragment: 'addToWhitelist',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'allPairs', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'allPairsLength',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'createPair', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getPairAddress',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'pairExists', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'removeFromWhitelist',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'whitelist', data: BytesLike): Result

  events: {
    'LogCreatePair(address,address,address,uint256)': EventFragment
    'OwnershipTransferred(address,address)': EventFragment
    'Paused(address)': EventFragment
    'Unpaused(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'LogCreatePair'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment
}

export interface LogCreatePairEventObject {
  _token0: string
  _token1: string
  _sender: string
  _pairsLength: BigNumber
}
export type LogCreatePairEvent = TypedEvent<
  [string, string, string, BigNumber],
  LogCreatePairEventObject
>

export type LogCreatePairEventFilter = TypedEventFilter<LogCreatePairEvent>

export interface OwnershipTransferredEventObject {
  previousOwner: string
  newOwner: string
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>

export interface PausedEventObject {
  account: string
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>

export type PausedEventFilter = TypedEventFilter<PausedEvent>

export interface UnpausedEventObject {
  account: string
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>

export interface PoolFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: PoolFactoryInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    addToWhitelist(
      toAddAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>

    allPairsLength(overrides?: CallOverrides): Promise<[BigNumber]>

    createPair(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      _fees: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    getPairAddress(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>

    owner(overrides?: CallOverrides): Promise<[string]>

    pairExists(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { _exists: boolean }>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    paused(overrides?: CallOverrides): Promise<[boolean]>

    removeFromWhitelist(
      toRemoveAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    whitelist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>
  }

  addToWhitelist(
    toAddAddresses: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  allPairs(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>

  allPairsLength(overrides?: CallOverrides): Promise<BigNumber>

  createPair(
    _token0: PromiseOrValue<string>,
    _token1: PromiseOrValue<string>,
    _fees: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  getPairAddress(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>

  owner(overrides?: CallOverrides): Promise<string>

  pairExists(
    _tokenA: PromiseOrValue<string>,
    _tokenB: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  paused(overrides?: CallOverrides): Promise<boolean>

  removeFromWhitelist(
    toRemoveAddresses: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  whitelist(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>

  callStatic: {
    addToWhitelist(
      toAddAddresses: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>

    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>

    createPair(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      _fees: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>

    getPairAddress(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>

    owner(overrides?: CallOverrides): Promise<string>

    pairExists(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>

    pause(overrides?: CallOverrides): Promise<void>

    paused(overrides?: CallOverrides): Promise<boolean>

    removeFromWhitelist(
      toRemoveAddresses: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>

    renounceOwnership(overrides?: CallOverrides): Promise<void>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>

    unpause(overrides?: CallOverrides): Promise<void>

    whitelist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>
  }

  filters: {
    'LogCreatePair(address,address,address,uint256)'(
      _token0?: null,
      _token1?: null,
      _sender?: null,
      _pairsLength?: null
    ): LogCreatePairEventFilter
    LogCreatePair(
      _token0?: null,
      _token1?: null,
      _sender?: null,
      _pairsLength?: null
    ): LogCreatePairEventFilter

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter

    'Paused(address)'(account?: null): PausedEventFilter
    Paused(account?: null): PausedEventFilter

    'Unpaused(address)'(account?: null): UnpausedEventFilter
    Unpaused(account?: null): UnpausedEventFilter
  }

  estimateGas: {
    addToWhitelist(
      toAddAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>

    createPair(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      _fees: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    getPairAddress(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    owner(overrides?: CallOverrides): Promise<BigNumber>

    pairExists(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    paused(overrides?: CallOverrides): Promise<BigNumber>

    removeFromWhitelist(
      toRemoveAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    whitelist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>
  }

  populateTransaction: {
    addToWhitelist(
      toAddAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    allPairsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>

    createPair(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      _fees: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    getPairAddress(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>

    pairExists(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>

    removeFromWhitelist(
      toRemoveAddresses: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    whitelist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>
  }
}
