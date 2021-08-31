import * as React from 'react'

import { TokenCache, useTokensCache } from '@/stores/TokensCacheService'
import { error, formatBalance } from '@/utils'


export type TokenFormattedBalanceOptions = {
    dexAccountBalance?: string;
    subscriberPrefix?: string;
    watchOnMount?: boolean;
    unwatchOnUnmount?: boolean;
}

export type TokenFormattedBalanceShape = {
    value: string;
    isFetching: boolean;
}


const mountedTokens: Record<string, boolean> = {}


export function useTokenFormattedBalance(
    token?: TokenCache,
    options?: TokenFormattedBalanceOptions,
): TokenFormattedBalanceShape {
    const tokensCache = useTokensCache()

    const {
        dexAccountBalance,
        subscriberPrefix = 'sub',
        watchOnMount = true,
        unwatchOnUnmount = watchOnMount as boolean,
    } = { ...options }

    const [balance, setBalance] = React.useState(
        formatBalance(
            token?.balance || '0',
            token?.decimals,
            dexAccountBalance || '0',
        ) || '0',
    )

    const [isFetching, setFetchingTo] = React.useState(false)

    React.useEffect(() => {
        setBalance(formatBalance(
            token?.balance || '0',
            token?.decimals,
            dexAccountBalance || '0',
        ) || '0')
    }, [dexAccountBalance, token?.balance])

    React.useEffect(() => {
        if (token) {
            mountedTokens[`${subscriberPrefix}-${token.root}`] = true;

            (async () => {
                setFetchingTo(true)
                try {
                    await tokensCache.syncToken(token.root)
                    if (mountedTokens[`${subscriberPrefix}-${token.root}`]) {
                        setBalance(formatBalance(
                            token?.balance || '0',
                            token?.decimals,
                            dexAccountBalance || '0',
                        ) || '0')
                        setFetchingTo(false)
                    }
                }
                catch (e) {
                    error('Token update failure', e)
                    if (mountedTokens[`${subscriberPrefix}-${token.root}`]) {
                        setFetchingTo(false)
                    }
                }
                finally {
                    if (mountedTokens[`${subscriberPrefix}-${token.root}`]) {
                        setFetchingTo(false)
                        if (watchOnMount) {
                            await tokensCache.watch(token.root, subscriberPrefix)
                        }
                    }
                }
            })()
        }

        return () => {
            if (token) {
                mountedTokens[`${subscriberPrefix}-${token.root}`] = false
            }

            if (token && unwatchOnUnmount) {
                tokensCache.unwatch(token.root, subscriberPrefix).catch(reason => error(reason))
            }
        }
    }, [token])

    return { value: balance, isFetching }
}
