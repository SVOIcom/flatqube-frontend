import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { TokenIcon } from '@/components/common/TokenIcon'
import { useField } from '@/hooks/useField'
import { useTokenFormattedBalance } from '@/hooks/useTokenFormattedBalance'
import { TokenCache } from '@/stores/TokensCacheService'


type Props = {
    disabled?: boolean;
    label: string;
    id?: string;
    isValid?: boolean;
    readOnly?: boolean;
    showMaxButton?: boolean;
    token?: TokenCache;
    value?: string;
    onChange?: (value: string) => void;
    onToggleTokensList?: () => void;
}


function Field({
    isValid = true,
    showMaxButton = false,
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
    })

    const deFormattedBalance = balance.value?.replace(/\s/g, '') ?? 0

    const onMax = () => {
        props.onChange?.(deFormattedBalance)
    }

    return (
        <label className="form-label" htmlFor={props.id}>
            <fieldset
                className={classNames('form-fieldset', {
                    invalid: !isValid,
                    checking: balance.isFetching && !props.disabled,
                })}
            >
                <div className="form-fieldset__header">
                    <div>{props.label}</div>
                    {token !== undefined && (
                        <div>
                            {intl.formatMessage({
                                id: 'SWAP_FIELD_TOKEN_WALLET_BALANCE',
                            }, {
                                balance: balance.value || token.balance,
                            })}
                        </div>
                    )}
                </div>
                <div className="form-fieldset__main">
                    <input
                        className="form-input"
                        id={props.id}
                        inputMode="decimal"
                        pattern="^[0-9]*[.]?[0-9]*$"
                        placeholder="0.0"
                        readOnly={props.readOnly}
                        type="text"
                        value={props.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                    />
                    {(token !== undefined && showMaxButton) && (
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
                            key="select-token"
                            type="button"
                            className={classNames('btn form-select', {
                                disabled: props.disabled,
                            })}
                            disabled={props.disabled}
                            onClick={props.onToggleTokensList}
                        >
                            <span className="form-select__txt">
                                {intl.formatMessage({
                                    id: 'SWAP_FIELD_BTN_TEXT_SELECT_TOKEN',
                                })}
                            </span>
                            <span className="form-select__arrow">
                                <Icon icon="arrowDown" ratio={1.2} />
                            </span>
                        </button>
                    ) : (
                        <button
                            key="change-token"
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
        </label>
    )
}


export const SwapField = observer(Field)
