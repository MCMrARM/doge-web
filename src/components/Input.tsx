import React from 'react';
import "./Input.sass";

export function Input(props: { onValueChange?: (value: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
    let filteredProps = {...props};
    delete filteredProps["onValueChange"];
    return (
        <input
            {...filteredProps}
            className={"Input" + (props.className ? ` ${props.className}` : "")}
            onChange={(v) => props.onValueChange?.(v.target.value)} />
    );
}
