import BigNumber from 'bignumber.js'
import {
    Address,
    Contract,
    DecodedAbiFunctionOutputs,
    FullContractState,
} from 'ton-inpage-provider'

import { DexAbi } from '@/misc'
import { SwapPair, SwapRouteResult, SwapRouteStep } from '@/modules/Swap/types'
import { TokenCache } from '@/stores/TokensCacheService'


export function mapStepResult(
    result: SwapRouteResult,
    src?: Address,
    amount?: SwapRouteResult['amount'],
    status?: SwapRouteResult['status'],
): SwapRouteResult {
    if (
        result.step.pair.address?.toString() === src?.toString()
        && result.status === undefined
    ) {
        return { ...result, amount, status }
    }
    return result
}

export function getFeeMultiplier(denominator: string, numerator: string): BigNumber {
    return new BigNumber(denominator).minus(numerator).div(denominator)
}

export async function getExpectedExchange(
    pairContract: Contract<typeof DexAbi.Pair>,
    amount: string,
    spentTokenAddress: Address,
    pairContractState?: FullContractState,
): Promise<DecodedAbiFunctionOutputs<typeof DexAbi.Pair, 'expectedExchange'>> {
    return pairContract.methods.expectedExchange({
        _answer_id: 0,
        amount,
        spent_token_root: spentTokenAddress,
    }).call({
        cachedState: pairContractState,
    })
}

export async function getExpectedSpendAmount(
    pairContract: Contract<typeof DexAbi.Pair>,
    receiveAmount: string,
    receiveTokenRoot: Address,
    pairContractState?: FullContractState,
): Promise<DecodedAbiFunctionOutputs<typeof DexAbi.Pair, 'expectedSpendAmount'>> {
    return pairContract.methods.expectedSpendAmount({
        _answer_id: 0,
        receive_amount: receiveAmount,
        receive_token_root: receiveTokenRoot,
    }).call({
        cachedState: pairContractState,
    })
}

export function getDefaultPerPrice(
    value: BigNumber,
    shiftedBy: number,
    dividedBy: BigNumber,
    decimalPlaces: number,
): BigNumber {
    return value
        .shiftedBy(-shiftedBy)
        .dividedBy(dividedBy)
        .decimalPlaces(decimalPlaces, BigNumber.ROUND_UP)
        .shiftedBy(shiftedBy)
}

export function getDirectExchangePerPrice(
    value: BigNumber,
    divided: BigNumber,
    shifted: number,
): BigNumber {
    return new BigNumber(value)
        .div(divided)
        .shiftedBy(shifted)
        .dp(0, BigNumber.ROUND_DOWN)
}

export function getDirectExchangePriceImpact(start: BigNumber, end: BigNumber): BigNumber {
    return end.minus(start)
        .div(start)
        .abs()
        .times(100)
        .dp(2, BigNumber.ROUND_UP)
}

export function getSlippageMinExpectedAmount(
    expectedAmount: BigNumber,
    slippage: string,
): BigNumber {
    return expectedAmount
        .div(100)
        .times(new BigNumber(100).minus(slippage))
        .dp(0, BigNumber.ROUND_DOWN)
}

export function getReducedCrossExchangeFee(iteratee: SwapRouteStep[], isInverted?: boolean): BigNumber {
    const fee = iteratee.reduceRight(
        (acc, step, idx, steps) => (
            acc
                .plus(step.fee)
                .times((isInverted ? steps[idx - 1]?.expectedAmount : steps[idx - 1]?.amount) || 1)
                .div((isInverted ? steps[idx - 1]?.amount : steps[idx - 1]?.expectedAmount) || 1)
        ),
        new BigNumber(0),
    )
    return fee.dp(0, BigNumber.ROUND_DOWN)
}

export function getReducedCrossExchangeAmount(
    initialAmount: BigNumber,
    initialToken: TokenCache,
    pairs: SwapPair[],
): BigNumber {
    let currentRoot: string | undefined = initialToken.root
    return pairs.reduce((acc, pair) => {
        if (
            pair.denominator === undefined
            || pair.numerator === undefined
            || pair.balances?.left === undefined
            || pair.balances?.right === undefined
            || pair.decimals?.left === undefined
            || pair.decimals?.right === undefined
        ) {
            return acc
        }

        const isInverted = pair.roots?.left.toString() !== currentRoot

        const leftBalanceBN = new BigNumber(pair.balances.left).shiftedBy(-pair.decimals.left)
        const rightBalanceBN = new BigNumber(pair.balances.right).shiftedBy(-pair.decimals.right)

        currentRoot = isInverted ? pair.roots?.left.toString() : pair.roots?.right.toString()

        return acc
            .times(getFeeMultiplier(pair.denominator, pair.numerator))
            .times(isInverted ? leftBalanceBN : rightBalanceBN)
            .div(isInverted ? rightBalanceBN : leftBalanceBN)
    }, initialAmount)
}

export function getCrossExchangePriceImpact(amount: BigNumber, expectedAmount: BigNumber): BigNumber {
    return new BigNumber(new BigNumber(amount).minus(expectedAmount))
        .div(amount)
        .times(100)
        .dp(2, BigNumber.ROUND_UP)
}

export function intersection(...arrays: Array<Array<string>>): string[] {
    const entries: Record<string, number> = {}
    const elements: Array<string> = arrays.reduce((acc, value) => acc.concat(...value), [])

    elements.forEach(value => {
        if (entries[value] !== undefined) {
            entries[value] += 1
        }
        else {
            entries[value] = 1
        }
    })

    return Object.entries(entries).filter(([_, count]) => count > 1).map(([value]) => value)
}
