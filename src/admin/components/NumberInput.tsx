import React, {CSSProperties, useLayoutEffect, useState} from 'react';
import "./NumberInput.sass";
import {Input} from "../../components/Input";

export function NumberInput(props: {value?: number, onValueChange?: (value: number) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
    let [isEmpty, setIsEmpty] = useState(false);
    useLayoutEffect(() => setIsEmpty(false), [props.value]);
    let onValueChange = (str: string) => {
        setIsEmpty(str.length === 0);
        if (str.length > 0 && !isNaN(parseInt(str)))
            props.onValueChange?.(parseInt(str));
    };
    return (
        <Input
            {...props}
            className={"NumberInput" + (props.className ? ` ${props.className}` : "")}
            type="number"
            value={isEmpty ? "" : props.value?.toString()}
            onValueChange={onValueChange}
            onBlur={(e) => { setIsEmpty(false); props.onBlur?.(e); }} />
    );
}
