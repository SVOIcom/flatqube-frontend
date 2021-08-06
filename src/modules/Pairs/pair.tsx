import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { Link, NavLink } from 'react-router-dom'

import { AccountExplorerLink } from '@/components/common/AccountExplorerLink'
import { Icon } from '@/components/common/Icon'
import { Pagination } from '@/components/common/Pagination'
import { PairIcons } from '@/modules/Pairs/components/PairIcons'
import { Stats } from '@/modules/Pairs/components/Stats'
import { usePairStore } from '@/modules/Pairs/providers/PairStoreProvider'
import { TransactionsList } from '@/modules/Transactions/components'
import { TransactionsOrdering } from '@/modules/Transactions/types'
import { useTokensCache } from '@/stores/TokensCacheService'

import './pair.scss'


function PairInner(): JSX.Element {
    const intl = useIntl()
    const tokensCache = useTokensCache()
    const store = usePairStore()

    const baseToken = React.useMemo(() => (
        store.pair?.meta.baseAddress ? tokensCache.get(store.pair.meta.baseAddress) : undefined
    ), [store.pair?.meta.baseAddress, tokensCache.tokens])

    const counterToken = React.useMemo(() => (
        store.pair?.meta.counterAddress ? tokensCache.get(store.pair.meta.counterAddress) : undefined
    ), [store.pair?.meta.counterAddress, tokensCache.tokens])

    const onTransactionsNextPage = async () => {
        if (store.transactionsCurrentPage < store.transactionsTotalPages) {
            store.changeState('transactionsCurrentPage', store.transactionsCurrentPage + 1)
            await store.loadTransactions()
        }
    }

    const onTransactionsPrevPage = async () => {
        if (store.transactionsCurrentPage > 1) {
            store.changeState('transactionsCurrentPage', store.transactionsCurrentPage - 1)
            await store.loadTransactions()
        }
    }

    const onChangeTransactionsPage = async (value: number) => {
        store.changeState('transactionsCurrentPage', value)
        await store.loadTransactions()
    }

    const onSwitchTransactionsOrdering = async (value: TransactionsOrdering) => {
        store.changeState('transactionsOrdering', value)
        store.changeState('transactionsCurrentPage', 1)
        await store.loadTransactions()
    }


    return (
        <>
            <section className="section section--large">
                <ul className="breadcrumb">
                    <li>
                        <NavLink to="/pairs">
                            {intl.formatMessage({
                                id: 'PAIR_BREADCRUMB_ROOT',
                            })}
                        </NavLink>
                    </li>
                    <li>
                        <span>
                            {baseToken?.symbol}
                            /
                            {counterToken?.symbol}
                        </span>
                    </li>
                </ul>

                <header className="pair-page__header">
                    <div>
                        <div className="pair-page__token">
                            <PairIcons
                                leftToken={baseToken}
                                rightToken={counterToken}
                            />
                            <div className="pair-page__token-name">
                                {baseToken?.symbol}
                                /
                                {counterToken?.symbol}
                            </div>
                        </div>
                    </div>
                    <div className="pair-page__header-actions">
                        {store.pair?.meta.poolAddress !== undefined && (
                            <AccountExplorerLink
                                address={store.pair?.meta.poolAddress}
                                className="btn btn-md btn-icon"
                            >
                                <Icon icon="externalLink" />
                            </AccountExplorerLink>
                        )}
                        <Link
                            className="btn btn-md btn-dark"
                            to={`/pool/${baseToken?.root || store.pair?.meta.baseAddress}/${counterToken?.root || store.pair?.meta.counterAddress}`}
                        >
                            {intl.formatMessage({
                                id: 'PAIR_ADD_LIQUIDITY_BTN_TEXT',
                            })}
                        </Link>
                        <Link
                            className="btn btn-md btn-light"
                            to={`/swap/${baseToken?.root || store.pair?.meta.baseAddress}/${counterToken?.root || store.pair?.meta.counterAddress}`}
                        >
                            {intl.formatMessage({
                                id: 'PAIR_TRADE_BTN_TEXT',
                            })}
                        </Link>
                    </div>
                </header>

                <Stats />
            </section>

            <section className="section section--large">
                <header className="section__header">
                    <h2 className="section-title">
                        {intl.formatMessage({
                            id: 'CURRENCY_TRANSACTIONS_LIST_HEADER_TITLE',
                        })}
                    </h2>
                </header>

                <div className="card card--small card--flat">
                    <TransactionsList
                        isLoading={store.isTransactionsLoading}
                        ordering={store.transactionsOrdering}
                        transactions={store.transactions}
                        onSwitchOrdering={onSwitchTransactionsOrdering}
                    />

                    <Pagination
                        currentPage={store.transactionsCurrentPage}
                        totalPages={store.transactionsTotalPages}
                        onNext={onTransactionsNextPage}
                        onPrev={onTransactionsPrevPage}
                        onSubmit={onChangeTransactionsPage}
                    />
                </div>
            </section>
        </>
    )
}


export const Pair = observer(PairInner)
