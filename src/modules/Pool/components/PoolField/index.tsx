import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Icon } from '@/components/common/Icon'
import { TokenIcon } from '@/components/common/TokenIcon'
import { useField } from '@/hooks/useField'
import { TokenCache } from '@/stores/TokensCacheService'
import { useTokenFormattedBalance } from '@/hooks/useTokenFormattedBalance'


type Props = {
    dexAccountBalance?: string;
    disabled?: boolean;
    label: string;
    isValid?: boolean;
    isCaution?: boolean;
    readOnly?: boolean;
    token?: TokenCache;
    value?: string;
    onKeyPress?: () => void;
    onChange?: (value: string) => void;
    onToggleTokensList?: () => void;
}


function Field({
    dexAccountBalance,
    isValid = true,
    token,
    ...props
}: Props): JSX.Element {
    const intl = useIntl()
    const field = useField({
        decimals: token?.decimals,
        value: props.value,
        onChange: props.onChange,
    })
    const balance = useTokenFormattedBalance(token, {
        subscriberPrefix: 'field',
        dexAccountBalance,
    })

    const deFormattedBalance = balance.value?.replace(/\s/g, '') ?? 0

    const isInsufficientBalance = React.useMemo(
        () => new BigNumber(props.value ?? 0).gt(deFormattedBalance),
        [props.value, balance.value],
    )

    const onMax = () => {
        props.onChange?.(deFormattedBalance)
    }

    return (
        <fieldset
            className={classNames('form-fieldset', {
                invalid: !isValid,
                caution: props.isCaution,
                checking: balance.isFetching,
            })}
        >
            <div className="form-fieldset__header">
                <div
                    className={classNames({
                        'text-muted': !isInsufficientBalance,
                        'text-danger': isInsufficientBalance,
                    })}
                >
                    {isInsufficientBalance ? intl.formatMessage({
                        id: 'POOL_INSUFFICIENT_TOKEN_BALANCE',
                    }) : props.label}
                </div>
                {token && (
                    <div className="text-muted">
                        {intl.formatMessage({
                            id: 'POOL_FIELD_TOKEN_WALLET_BALANCE',
                        }, {
                            balance: balance.value,
                        })}
                    </div>
                )}
            </div>
            <div className="form-fieldset__main">
                <input
                    className="form-input"
                    inputMode="decimal"
                    pattern="^[0-9]*[.]?[0-9]*$"
                    placeholder="0.0"
                    readOnly={props.readOnly}
                    type="text"
                    value={props.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    onKeyPress={props.onKeyPress}
                />
                {token !== undefined && (
                    <button
                        key="max-button"
                        type="button"
                        className="btn btn-xs btn-secondary form-btn-max"
                        disabled={props.disabled}
                        onClick={onMax}
                    >
                        Max
                    </button>
                )}
                {token === undefined ? (
                    <button
                        type="button"
                        className={classNames('btn form-select', {
                            disabled: props.disabled,
                        })}
                        disabled={props.disabled}
                        onClick={props.onToggleTokensList}
                    >
                        <span className="form-select__txt">
                            {intl.formatMessage({
                                id: 'POOL_FIELD_BTN_TEXT_SELECT_TOKEN',
                            })}
                        </span>
                        <span className="form-select__arrow">
                            <Icon icon="arrowDown" ratio={1.2} />
                        </span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className={classNames('btn form-drop', {
                            disabled: props.disabled,
                        })}
                        disabled={props.disabled}
                        onClick={props.onToggleTokensList}
                    >
                        <span className="form-drop__logo">
                            <TokenIcon
                                address={token.root}
                                name={token.symbol}
                                size="small"
                                icon={token.icon}
                            />
                        </span>
                        <span className="form-drop__name">
                            {token.symbol}
                        </span>
                        <span className="form-drop__arrow">
                            <Icon icon="arrowDown" ratio={1.2} />
                        </span>
                    </button>
                )}
            </div>
        </fieldset>
    )
}


export const PoolField = observer(Field)
