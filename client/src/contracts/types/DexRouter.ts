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
  PayableOverrides,
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

export interface DexRouterInterface extends utils.Interface {
  functions: {
    'WETH()': FunctionFragment
    '_ownerFees()': FunctionFragment
    'addLiquidityETH(address,uint256,uint256,uint256)': FunctionFragment
    'addTokenToTokenLiquidity(address,address,uint256,uint256,uint256,uint256)': FunctionFragment
    'factory()': FunctionFragment
    'getTokenAmountOut(address,address,uint256)': FunctionFragment
    'getTokenPairRatio(address,address,uint256)': FunctionFragment
    'getTokenPairReserves(address,address)': FunctionFragment
    'owner()': FunctionFragment
    'removeLiquidity(address,address,uint256,uint256,uint256,address)': FunctionFragment
    'removeLiquidityETH(address,uint256,uint256,uint256,address)': FunctionFragment
    'renounceOwnership()': FunctionFragment
    'setNewPoolFactory(address)': FunctionFragment
    'swapETHForTokens(address,uint256)': FunctionFragment
    'swapTokensForETH(address,uint256,uint256)': FunctionFragment
    'swapTokensWithFees(address,address,uint256,uint256)': FunctionFragment
    'transferOwnership(address)': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'WETH'
      | '_ownerFees'
      | 'addLiquidityETH'
      | 'addTokenToTokenLiquidity'
      | 'factory'
      | 'getTokenAmountOut'
      | 'getTokenPairRatio'
      | 'getTokenPairReserves'
      | 'owner'
      | 'removeLiquidity'
      | 'removeLiquidityETH'
      | 'renounceOwnership'
      | 'setNewPoolFactory'
      | 'swapETHForTokens'
      | 'swapTokensForETH'
      | 'swapTokensWithFees'
      | 'transferOwnership'
  ): FunctionFragment

  encodeFunctionData(functionFragment: 'WETH', values?: undefined): string
  encodeFunctionData(functionFragment: '_ownerFees', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'addLiquidityETH',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'addTokenToTokenLiquidity',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(functionFragment: 'factory', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'getTokenAmountOut',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'getTokenPairRatio',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'getTokenPairReserves',
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'removeLiquidity',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'removeLiquidityETH',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined
  ): string
  encodeFunctionData(
    functionFragment: 'setNewPoolFactory',
    values: [PromiseOrValue<string>]
  ): string
  encodeFunctionData(
    functionFragment: 'swapETHForTokens',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'swapTokensForETH',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'swapTokensWithFees',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [PromiseOrValue<string>]
  ): string

  decodeFunctionResult(functionFragment: 'WETH', data: BytesLike): Result
  decodeFunctionResult(functionFragment: '_ownerFees', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'addLiquidityETH',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'addTokenToTokenLiquidity',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'factory', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getTokenAmountOut',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'getTokenPairRatio',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'getTokenPairReserves',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'removeLiquidity',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'removeLiquidityETH',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'setNewPoolFactory',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'swapETHForTokens',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'swapTokensForETH',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'swapTokensWithFees',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike
  ): Result

  events: {
    'LogAddLiquidityETH(address,address,uint256,address,uint256)': EventFragment
    'LogAddTokenToTokenLiquidity(address,address,address,uint256,uint256,address)': EventFragment
    'LogRemoveLiquidity(address,address,address,uint256,uint256,uint256,address)': EventFragment
    'LogRemoveLiquidityETH(address,address,uint256,uint256,uint256)': EventFragment
    'LogSwapETHForTokens(address,uint256,address,address)': EventFragment
    'LogSwapTokensForETH(address,uint256,address,address)': EventFragment
    'LogSwapTokensWithFees(address,address,address,address,uint256,uint256,uint256)': EventFragment
    'OwnershipTransferred(address,address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'LogAddLiquidityETH'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogAddTokenToTokenLiquidity'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogRemoveLiquidity'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogRemoveLiquidityETH'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogSwapETHForTokens'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogSwapTokensForETH'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'LogSwapTokensWithFees'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment
}

export interface LogAddLiquidityETHEventObject {
  _sender: string
  _token: string
  _amountToken: BigNumber
  _poolAddress: string
  _shares: BigNumber
}
export type LogAddLiquidityETHEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber],
  LogAddLiquidityETHEventObject
>

export type LogAddLiquidityETHEventFilter =
  TypedEventFilter<LogAddLiquidityETHEvent>

export interface LogAddTokenToTokenLiquidityEventObject {
  _sender: string
  _tokenA: string
  _tokenB: string
  amountA: BigNumber
  amountB: BigNumber
  poolAddress: string
}
export type LogAddTokenToTokenLiquidityEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, string],
  LogAddTokenToTokenLiquidityEventObject
>

export type LogAddTokenToTokenLiquidityEventFilter =
  TypedEventFilter<LogAddTokenToTokenLiquidityEvent>

export interface LogRemoveLiquidityEventObject {
  _sender: string
  _tokenA: string
  _tokenB: string
  _shares: BigNumber
  _amountA: BigNumber
  _amountB: BigNumber
  poolAddress: string
}
export type LogRemoveLiquidityEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, BigNumber, string],
  LogRemoveLiquidityEventObject
>

export type LogRemoveLiquidityEventFilter =
  TypedEventFilter<LogRemoveLiquidityEvent>

export interface LogRemoveLiquidityETHEventObject {
  _sender: string
  _token: string
  _shares: BigNumber
  _amountToken: BigNumber
  _amountETH: BigNumber
}
export type LogRemoveLiquidityETHEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber],
  LogRemoveLiquidityETHEventObject
>

export type LogRemoveLiquidityETHEventFilter =
  TypedEventFilter<LogRemoveLiquidityETHEvent>

export interface LogSwapETHForTokensEventObject {
  _sender: string
  _amountIn: BigNumber
  _tokenOut: string
  _poolAddress: string
}
export type LogSwapETHForTokensEvent = TypedEvent<
  [string, BigNumber, string, string],
  LogSwapETHForTokensEventObject
>

export type LogSwapETHForTokensEventFilter =
  TypedEventFilter<LogSwapETHForTokensEvent>

export interface LogSwapTokensForETHEventObject {
  _sender: string
  _amountIn: BigNumber
  _tokenIn: string
  _poolAddress: string
}
export type LogSwapTokensForETHEvent = TypedEvent<
  [string, BigNumber, string, string],
  LogSwapTokensForETHEventObject
>

export type LogSwapTokensForETHEventFilter =
  TypedEventFilter<LogSwapTokensForETHEvent>

export interface LogSwapTokensWithFeesEventObject {
  _sender: string
  _tokenIn: string
  _tokenOut: string
  _poolAddress: string
  _fees: BigNumber
  _amountIn: BigNumber
  _amountOut: BigNumber
}
export type LogSwapTokensWithFeesEvent = TypedEvent<
  [string, string, string, string, BigNumber, BigNumber, BigNumber],
  LogSwapTokensWithFeesEventObject
>

export type LogSwapTokensWithFeesEventFilter =
  TypedEventFilter<LogSwapTokensWithFeesEvent>

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

export interface DexRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: DexRouterInterface

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
    WETH(overrides?: CallOverrides): Promise<[string]>

    _ownerFees(overrides?: CallOverrides): Promise<[BigNumber]>

    addLiquidityETH(
      _token: PromiseOrValue<string>,
      _amountTokenDesired: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    addTokenToTokenLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountADesired: PromiseOrValue<BigNumberish>,
      _amountBDesired: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    factory(overrides?: CallOverrides): Promise<[string]>

    getTokenAmountOut(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountOut: BigNumber }>

    getTokenPairRatio(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountOut: BigNumber }>

    getTokenPairReserves(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0: BigNumber; amount1: BigNumber }
    >

    owner(overrides?: CallOverrides): Promise<[string]>

    removeLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    removeLiquidityETH(
      _token: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    setNewPoolFactory(
      _factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    swapETHForTokens(
      _tokenOut: PromiseOrValue<string>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    swapTokensForETH(
      _tokenIn: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    swapTokensWithFees(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>
  }

  WETH(overrides?: CallOverrides): Promise<string>

  _ownerFees(overrides?: CallOverrides): Promise<BigNumber>

  addLiquidityETH(
    _token: PromiseOrValue<string>,
    _amountTokenDesired: PromiseOrValue<BigNumberish>,
    _amountTokenMin: PromiseOrValue<BigNumberish>,
    _amountETHMin: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  addTokenToTokenLiquidity(
    _tokenA: PromiseOrValue<string>,
    _tokenB: PromiseOrValue<string>,
    _amountADesired: PromiseOrValue<BigNumberish>,
    _amountBDesired: PromiseOrValue<BigNumberish>,
    _amountAMin: PromiseOrValue<BigNumberish>,
    _amountBMin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  factory(overrides?: CallOverrides): Promise<string>

  getTokenAmountOut(
    _tokenIn: PromiseOrValue<string>,
    _tokenOut: PromiseOrValue<string>,
    _amountIn: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>

  getTokenPairRatio(
    _tokenA: PromiseOrValue<string>,
    _tokenB: PromiseOrValue<string>,
    _amountIn: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>

  getTokenPairReserves(
    _token0: PromiseOrValue<string>,
    _token1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { amount0: BigNumber; amount1: BigNumber }
  >

  owner(overrides?: CallOverrides): Promise<string>

  removeLiquidity(
    _tokenA: PromiseOrValue<string>,
    _tokenB: PromiseOrValue<string>,
    _shares: PromiseOrValue<BigNumberish>,
    _amountAMin: PromiseOrValue<BigNumberish>,
    _amountBMin: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  removeLiquidityETH(
    _token: PromiseOrValue<string>,
    _shares: PromiseOrValue<BigNumberish>,
    _amountTokenMin: PromiseOrValue<BigNumberish>,
    _amountETHMin: PromiseOrValue<BigNumberish>,
    _to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  setNewPoolFactory(
    _factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  swapETHForTokens(
    _tokenOut: PromiseOrValue<string>,
    _minAmountOut: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  swapTokensForETH(
    _tokenIn: PromiseOrValue<string>,
    _amountIn: PromiseOrValue<BigNumberish>,
    _minAmountOut: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  swapTokensWithFees(
    _tokenIn: PromiseOrValue<string>,
    _tokenOut: PromiseOrValue<string>,
    _amountIn: PromiseOrValue<BigNumberish>,
    _minAmountOut: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  callStatic: {
    WETH(overrides?: CallOverrides): Promise<string>

    _ownerFees(overrides?: CallOverrides): Promise<BigNumber>

    addLiquidityETH(
      _token: PromiseOrValue<string>,
      _amountTokenDesired: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountToken: BigNumber
        amountETH: BigNumber
        shares: BigNumber
      }
    >

    addTokenToTokenLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountADesired: PromiseOrValue<BigNumberish>,
      _amountBDesired: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountA: BigNumber
        amountB: BigNumber
        liquidity: BigNumber
      }
    >

    factory(overrides?: CallOverrides): Promise<string>

    getTokenAmountOut(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    getTokenPairRatio(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    getTokenPairReserves(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0: BigNumber; amount1: BigNumber }
    >

    owner(overrides?: CallOverrides): Promise<string>

    removeLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountA: BigNumber; amountB: BigNumber }
    >

    removeLiquidityETH(
      _token: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountToken: BigNumber; amountETH: BigNumber }
    >

    renounceOwnership(overrides?: CallOverrides): Promise<void>

    setNewPoolFactory(
      _factory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>

    swapETHForTokens(
      _tokenOut: PromiseOrValue<string>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    swapTokensForETH(
      _tokenIn: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    swapTokensWithFees(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>
  }

  filters: {
    'LogAddLiquidityETH(address,address,uint256,address,uint256)'(
      _sender?: null,
      _token?: null,
      _amountToken?: null,
      _poolAddress?: null,
      _shares?: null
    ): LogAddLiquidityETHEventFilter
    LogAddLiquidityETH(
      _sender?: null,
      _token?: null,
      _amountToken?: null,
      _poolAddress?: null,
      _shares?: null
    ): LogAddLiquidityETHEventFilter

    'LogAddTokenToTokenLiquidity(address,address,address,uint256,uint256,address)'(
      _sender?: null,
      _tokenA?: null,
      _tokenB?: null,
      amountA?: null,
      amountB?: null,
      poolAddress?: null
    ): LogAddTokenToTokenLiquidityEventFilter
    LogAddTokenToTokenLiquidity(
      _sender?: null,
      _tokenA?: null,
      _tokenB?: null,
      amountA?: null,
      amountB?: null,
      poolAddress?: null
    ): LogAddTokenToTokenLiquidityEventFilter

    'LogRemoveLiquidity(address,address,address,uint256,uint256,uint256,address)'(
      _sender?: null,
      _tokenA?: null,
      _tokenB?: null,
      _shares?: null,
      _amountA?: null,
      _amountB?: null,
      poolAddress?: null
    ): LogRemoveLiquidityEventFilter
    LogRemoveLiquidity(
      _sender?: null,
      _tokenA?: null,
      _tokenB?: null,
      _shares?: null,
      _amountA?: null,
      _amountB?: null,
      poolAddress?: null
    ): LogRemoveLiquidityEventFilter

    'LogRemoveLiquidityETH(address,address,uint256,uint256,uint256)'(
      _sender?: null,
      _token?: null,
      _shares?: null,
      _amountToken?: null,
      _amountETH?: null
    ): LogRemoveLiquidityETHEventFilter
    LogRemoveLiquidityETH(
      _sender?: null,
      _token?: null,
      _shares?: null,
      _amountToken?: null,
      _amountETH?: null
    ): LogRemoveLiquidityETHEventFilter

    'LogSwapETHForTokens(address,uint256,address,address)'(
      _sender?: null,
      _amountIn?: null,
      _tokenOut?: null,
      _poolAddress?: null
    ): LogSwapETHForTokensEventFilter
    LogSwapETHForTokens(
      _sender?: null,
      _amountIn?: null,
      _tokenOut?: null,
      _poolAddress?: null
    ): LogSwapETHForTokensEventFilter

    'LogSwapTokensForETH(address,uint256,address,address)'(
      _sender?: null,
      _amountIn?: null,
      _tokenIn?: null,
      _poolAddress?: null
    ): LogSwapTokensForETHEventFilter
    LogSwapTokensForETH(
      _sender?: null,
      _amountIn?: null,
      _tokenIn?: null,
      _poolAddress?: null
    ): LogSwapTokensForETHEventFilter

    'LogSwapTokensWithFees(address,address,address,address,uint256,uint256,uint256)'(
      _sender?: null,
      _tokenIn?: null,
      _tokenOut?: null,
      _poolAddress?: null,
      _fees?: null,
      _amountIn?: null,
      _amountOut?: null
    ): LogSwapTokensWithFeesEventFilter
    LogSwapTokensWithFees(
      _sender?: null,
      _tokenIn?: null,
      _tokenOut?: null,
      _poolAddress?: null,
      _fees?: null,
      _amountIn?: null,
      _amountOut?: null
    ): LogSwapTokensWithFeesEventFilter

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter
  }

  estimateGas: {
    WETH(overrides?: CallOverrides): Promise<BigNumber>

    _ownerFees(overrides?: CallOverrides): Promise<BigNumber>

    addLiquidityETH(
      _token: PromiseOrValue<string>,
      _amountTokenDesired: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    addTokenToTokenLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountADesired: PromiseOrValue<BigNumberish>,
      _amountBDesired: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    factory(overrides?: CallOverrides): Promise<BigNumber>

    getTokenAmountOut(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    getTokenPairRatio(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    getTokenPairReserves(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    owner(overrides?: CallOverrides): Promise<BigNumber>

    removeLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    removeLiquidityETH(
      _token: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    setNewPoolFactory(
      _factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    swapETHForTokens(
      _tokenOut: PromiseOrValue<string>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    swapTokensForETH(
      _tokenIn: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    swapTokensWithFees(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>
  }

  populateTransaction: {
    WETH(overrides?: CallOverrides): Promise<PopulatedTransaction>

    _ownerFees(overrides?: CallOverrides): Promise<PopulatedTransaction>

    addLiquidityETH(
      _token: PromiseOrValue<string>,
      _amountTokenDesired: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    addTokenToTokenLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountADesired: PromiseOrValue<BigNumberish>,
      _amountBDesired: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getTokenAmountOut(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    getTokenPairRatio(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    getTokenPairReserves(
      _token0: PromiseOrValue<string>,
      _token1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>

    removeLiquidity(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountAMin: PromiseOrValue<BigNumberish>,
      _amountBMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    removeLiquidityETH(
      _token: PromiseOrValue<string>,
      _shares: PromiseOrValue<BigNumberish>,
      _amountTokenMin: PromiseOrValue<BigNumberish>,
      _amountETHMin: PromiseOrValue<BigNumberish>,
      _to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    setNewPoolFactory(
      _factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    swapETHForTokens(
      _tokenOut: PromiseOrValue<string>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    swapTokensForETH(
      _tokenIn: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    swapTokensWithFees(
      _tokenIn: PromiseOrValue<string>,
      _tokenOut: PromiseOrValue<string>,
      _amountIn: PromiseOrValue<BigNumberish>,
      _minAmountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>
  }
}
