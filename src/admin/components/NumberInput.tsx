import React, {CSSProperties, useLayoutEffect, useState} from 'react';
import "./NumberInput.sass";
import {Input} from "../../components/Input";

export function NumberInput(props: { style?: CSSProperties, className?: string, value: number, placeholder?: string, onChange?: (value: number) => void, onBlur?: () => void }) {
    let [isEmpty, setIsEmpty] = useState(false);
    useLayoutEffect(() => setIsEmpty(false), [props.value]);
    let onChange = (str: string) => {
        setIsEmpty(str.length === 0);
        if (str.length > 0 && !isNaN(parseInt(str)))
            props.onChange?.(parseInt(str));
    };
    let onBlur = () => {
        setIsEmpty(false);
        props.onBlur?.();
    };
    return (
        <Input
            className={"NumberInput" + (props.className ? ` ${props.className}` : "")}
            style={props.style}
            type="number"
            placeholder={props.placeholder}
            value={isEmpty ? "" : props.value.toString()}
            onValueChange={onChange}
            onBlur={onBlur} />
    );
}
