import React from 'react';
import "./Input.sass";

export function Input(props: { onValueChange?: (value: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={"Input" + (props.className ? ` ${props.className}` : "")}
            onChange={(v) => props.onValueChange?.(v.target.value)} />
    );
}
