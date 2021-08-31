import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'


type Props = {
    disabled?: boolean;
    label: string;
    type?: string;
    isValid?: boolean;
    readOnly?: boolean;
    pattern?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
};


function Field({ type = 'text', isValid = true, ...props }: Props): JSX.Element {
    const valueWasChanged = React.useRef<boolean>(false)

    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target

        props.onChange?.(value)
        valueWasChanged.current = true
    }

    return (
        <fieldset
            className={classNames('form-fieldset', {
                invalid: valueWasChanged.current && !isValid,
            })}
        >
            <div className="form-fieldset__header">
                <div>{props.label}</div>
            </div>
            <div className="form-fieldset__main">
                <input
                    disabled={props.disabled}
                    type={type}
                    className="form-input"
                    placeholder={props.placeholder}
                    value={props.value}
                    readOnly={props.readOnly}
                    pattern={props.pattern}
                    onChange={onChange}
                />
            </div>
        </fieldset>
    )
}

export const BuilderField = observer(Field)
