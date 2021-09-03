import {
    Address, Contract, DecodedAbiFunctionInputs, FullContractState, Transaction,
} from 'ton-inpage-provider'

import { DexAbi } from '@/misc'
import { TokenCache } from '@/stores/TokensCacheService'

export type SwapBill = {
    amount?: string;
    expectedAmount?: string;
    fee?: string;
    minExpectedAmount?: string;
    _minExpectedAmount?: string;
    priceImpact?: string;
}

export type SwapPairBalances = {
    left: string;
    right: string;
}

export type SwapPairDecimals = {
    left: number;
    right: number;
}

export type SwapPairSymbols = {
    left: string;
    right: string;
}

export type SwapPairRoots = {
    left: Address;
    right: Address;
}

export type SwapPair = {
    address?: Address;
    balances?: SwapPairBalances;
    contract?: Contract<typeof DexAbi.Pair>;
    decimals?: SwapPairDecimals;
    denominator?: string;
    numerator?: string;
    roots?: SwapPairRoots;
    state?: FullContractState;
    symbols?: SwapPairSymbols;
}

export type SwapRouteResult = {
    amount?: string;
    status?: 'success' | 'cancel';
    step: SwapRouteStep;
    transaction?: Transaction;
}

export type SwapRouteStep = {
    amount: string;
    expectedAmount: string;
    fee: string;
    from?: string;
    minExpectedAmount: string;
    pair: SwapPair;
    receiveAddress: Address;
    spentAddress: Address;
    to?: string;
}

export type SwapRoute = {
    bill: SwapBill;
    leftAmount: string;
    pairs: SwapPair[];
    priceLeftToRight?: string;
    priceRightToLeft?: string;
    rightAmount: string;
    slippage?: string;
    steps: SwapRouteStep[];
    tokens: TokenCache[];
}

export type SwapStoreData = {
    bestCrossExchangeRoute?: SwapRoute;
    crossPairs: SwapPair[];
    leftAmount: string;
    leftToken?: string;
    pair?: SwapPair;
    priceLeftToRight?: string;
    priceRightToLeft?: string;
    rightAmount: string;
    rightToken?: string;
    routes: SwapRoute[];
    slippage: string;
}

export enum SwapExchangeMode {
    CROSS_PAIR_EXCHANGE = 'crossPair',
    DIRECT_EXCHANGE = 'direct',
}

export enum SwapDirection {
    LTR = 'ltr',
    RTL = 'rtl',
}

export type SwapStoreState = {
    direction: SwapDirection;
    exchangeMode: SwapExchangeMode;
    isCalculating: boolean;
    isConfirmationAwait: boolean;
    isCrossExchangeCalculating: boolean;
    isCrossExchangePreparing: boolean;
    isEnoughLiquidity: boolean;
    isPairChecking: boolean;
    isSwapping: boolean;
    priceDirection?: SwapDirection;
}

export type SwapTransactionReceipt = {
    amount?: string;
    hash?: string;
    isCrossExchangeCanceled?: boolean;
    receivedDecimals?: number;
    receivedIcon?: string;
    receivedRoot?: string;
    receivedSymbol?: string;
    slippage?: string;
    spentAmount?: string;
    spentDecimals?: number;
    spentIcon?: string;
    spentFee?: string;
    spentRoot?: string;
    spentSymbol?: string;
    success: boolean;
}

export type SwapSuccessResult = {
    input: DecodedAbiFunctionInputs<typeof DexAbi.Callbacks, 'dexPairExchangeSuccess'>;
    transaction: Transaction;
}

export type SwapFailureResult = {
    cancelStep?: SwapRouteResult;
    index?: number;
    input?: DecodedAbiFunctionInputs<typeof DexAbi.Callbacks, 'dexPairOperationCancelled'>;
    step?: SwapRouteResult;
}
