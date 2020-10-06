import React, {createRef, useLayoutEffect} from 'react';
import "./TextArea.sass";

export function TextArea(props: { onValueChange?: (value: string) => void } & React.InputHTMLAttributes<HTMLTextAreaElement>) {
    const textAreaRef = createRef<HTMLTextAreaElement>();
    const updateHeight = () => {
        let area = textAreaRef.current!;
        area.style.height = "0";
        area.style.height = (area.scrollHeight + 2) + "px"; // 2px accounts for border
    };
    useLayoutEffect(updateHeight, [props.value]);

    const filteredProps = {...props};
    delete filteredProps["onValueChange"];
    return (
        <textarea
            {...filteredProps}
            ref={textAreaRef}
            className={"Input TextArea" + (props.className ? ` ${props.className}` : "")}
            onInput={updateHeight}
            onChange={(v) => props.onValueChange?.(v.target.value)} />
    );
}
