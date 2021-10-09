import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { FarmingAction } from '@/modules/Farming/components/FarmingAction'
import { useTokensCache } from '@/stores/TokensCacheService'
import { amountOrZero, isExists } from '@/utils'

enum Tab {
    Claim = 1,
    Withdraw = 2,
}

type Props = {
    loading?: boolean;
    farmingAmount: string;
    withdrawAmount?: string;
    withdrawDisabled?: boolean;
    claimDisabled?: boolean;
    rootTokenSymbol: string;
    rewardTokenRoots: string[];
    rewardAmounts: string[];
    onChangeWithdraw: (value: string) => void;
    onWithdraw: (amount: string) => void;
    onClaim: () => void;
}

export function FarmingWithdrawInner({
    loading,
    farmingAmount,
    withdrawAmount,
    withdrawDisabled,
    claimDisabled,
    rootTokenSymbol,
    rewardTokenRoots,
    rewardAmounts,
    onChangeWithdraw,
    onWithdraw,
    onClaim,
}: Props): JSX.Element {
    const intl = useIntl()
    const tokensCache = useTokensCache()
    const [activeTab, setActiveTab] = React.useState(Tab.Claim)
    const rewardTokens = rewardTokenRoots.map(root => tokensCache.get(root))
    const rewards = rewardTokens
        .map((token, index) => (
            token && {
                amount: amountOrZero(rewardAmounts[index], token.decimals),
                symbol: token.symbol,
            }
        ))
        .filter(isExists)

    const onClickClaimTab = () => {
        setActiveTab(Tab.Claim)
    }

    const onClickWithdrawTab = () => {
        setActiveTab(Tab.Withdraw)
    }

    return (
        <div className="farming-balance-panel farming-balance-panel_withdraw">
            <div className="farming-balance-panel__title">
                {intl.formatMessage({
                    id: 'FARMING_BALANCE_WITHDRAW_TITLE',
                })}
            </div>

            <ul className="farming-balance-panel__tabs">
                <li
                    className={activeTab === Tab.Claim ? 'active' : undefined}
                    onClick={onClickClaimTab}
                >
                    {intl.formatMessage({
                        id: 'FARMING_BALANCE_WITHDRAW_CLAIM_TAB',
                    })}
                </li>
                <li
                    className={activeTab === Tab.Withdraw ? 'active' : undefined}
                    onClick={onClickWithdrawTab}
                >
                    {intl.formatMessage({
                        id: 'FARMING_BALANCE_WITHDRAW_WITHDRAW_TAB',
                    })}
                </li>
            </ul>

            {activeTab === Tab.Claim && (
                <FarmingAction
                    inputDisabled
                    loading={loading}
                    submitDisabled={claimDisabled}
                    action={intl.formatMessage({
                        id: 'FARMING_BALANCE_WITHDRAW_ACTION_CLAIM',
                    })}
                    value={rewards.map(({ amount, symbol }) => (
                        intl.formatMessage({
                            id: 'FARMING_BALANCE_TOKEN',
                        }, { amount, symbol })
                    )).join(', ')}
                    onSubmit={onClaim}
                />
            )}

            {activeTab === Tab.Withdraw && (
                <FarmingAction
                    loading={loading}
                    value={withdrawAmount || ''}
                    maxValue={farmingAmount}
                    submitDisabled={withdrawDisabled}
                    action={intl.formatMessage({
                        id: 'FARMING_BALANCE_WITHDRAW_ACTION_WITHDRAW',
                    })}
                    hint={intl.formatMessage({
                        id: 'FARMING_BALANCE_WITHDRAW_BALANCE',
                    }, {
                        value: farmingAmount,
                        symbol: rootTokenSymbol,
                    })}
                    onChange={onChangeWithdraw}
                    onSubmit={onWithdraw}
                />
            )}
        </div>
    )
}

export const FarmingWithdraw = observer(FarmingWithdrawInner)