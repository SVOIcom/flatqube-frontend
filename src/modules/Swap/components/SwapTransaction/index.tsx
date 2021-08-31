import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { UserAvatar } from '@/components/common/UserAvatar'
import { useSwapStore } from '@/modules/Swap/stores/SwapStore'
import { amount } from '@/utils'
import { AccountExplorerLink } from '@/components/common/AccountExplorerLink'
import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'


function Transaction(): JSX.Element | null {
    const intl = useIntl()
    const swap = useSwapStore()

    if (swap.transaction == null) {
        return null
    }

    const actions = (
        <div key="actions" className="popup-actions">
            {swap.transaction.receivedRoot !== undefined && (
                <AccountExplorerLink
                    address={swap.transaction.receivedRoot}
                    className="btn btn-secondary"
                >
                    {intl.formatMessage({
                        id: 'SWAP_TRANSACTION_RECEIPT_LINK_TXT_TOKEN_ROOT_CONTRACT',
                    })}
                </AccountExplorerLink>
            )}
            {swap.transaction.hash !== undefined && (
                <TransactionExplorerLink
                    id={swap.transaction.hash}
                    className="btn btn-secondary"
                >
                    {intl.formatMessage({
                        id: 'SWAP_TRANSACTION_RECEIPT_LINK_TXT_TRANSACTION',
                    })}
                </TransactionExplorerLink>
            )}
        </div>
    )
    const receivedToken = (
        <div key="receivedToken" className="popup-main nb np">
            <div className="popup-main__ava">
                {swap.transaction.receivedIcon ? (
                    <img
                        alt={swap.transaction.receivedSymbol}
                        src={swap.transaction.receivedIcon}
                    />
                ) : swap.transaction.receivedRoot !== undefined && (
                    <UserAvatar
                        address={swap.transaction.receivedRoot}
                    />
                )}
            </div>
            <div
                className="popup-main__name"
                dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                        id: 'SWAP_TRANSACTION_RECEIPT_LEAD_SUCCESSFUL_AMOUNT',
                    }, {
                        value: amount(
                            swap.transaction.receivedAmount || '0',
                            swap.transaction.receivedDecimals,
                        ) || '0',
                        symbol: swap.transaction.receivedSymbol,
                    }, {
                        ignoreTag: true,
                    }),
                }}
            />
        </div>
    )

    return ReactDOM.createPortal(
        <div className="popup">
            <div className="popup-overlay" />
            <div className="popup__wrap">
                <button
                    type="button"
                    className="btn btn-icon popup-close"
                    onClick={swap.cleanTransactionResult}
                >
                    <Icon icon="close" />
                </button>
                <h2 className="popup-title">
                    {intl.formatMessage({
                        id: swap.transaction.success
                            ? 'SWAP_TRANSACTION_RECEIPT_POPUP_TITLE_SUCCESS'
                            : 'SWAP_TRANSACTION_RECEIPT_POPUP_TITLE_FAILURE',
                    })}
                </h2>
                {swap.transaction.success ? (
                    <>
                        {receivedToken}
                        {actions}
                    </>
                ) : (
                    <>
                        <div
                            key="failureText"
                            className="popup-txt"
                            dangerouslySetInnerHTML={{
                                __html: intl.formatMessage({
                                    id: swap.transaction.isCrossExchangeCanceled
                                        ? 'SWAP_TRANSACTION_RECEIPT_CROSS_EXCHANGE_CANCELLED_NOTE'
                                        : 'SWAP_TRANSACTION_RECEIPT_CANCELLED_NOTE',
                                }, {
                                    leftSymbol: swap.leftToken?.symbol,
                                    rightSymbol: swap.rightToken?.symbol,
                                    slippage: swap.bestCrossExchangeRoute?.slippage,
                                    tokenSymbol: swap.transaction.receivedSymbol,
                                }),
                            }}
                        />
                        {swap.transaction.isCrossExchangeCanceled && receivedToken}
                        {actions}
                    </>
                )}
            </div>
        </div>,
        document.body,
    )
}

export const SwapTransaction = observer(Transaction)
