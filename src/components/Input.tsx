import React, {createRef, CSSProperties, useLayoutEffect} from 'react';
import "./Input.sass";

export function Input(props: { style?: CSSProperties, className?: string, type?: string, value?: string, placeholder?: string, onChange?: (value: string) => void, onBlur?: () => void }) {
    return (
        <input
            className={"Input" + (props.className ? ` ${props.className}` : "")}
            style={props.style}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(v) => props.onChange?.(v.target.value)}
            onBlur={props.onBlur} />
    );
}
