import React, {createRef, CSSProperties, useLayoutEffect} from 'react';
import "./TextArea.sass";

export function TextArea(props: { style?: CSSProperties, className?: string, value?: string, placeholder?: string }) {
    let textAreaRef = createRef<HTMLTextAreaElement>();
    let updateHeight = () => {
        let area = textAreaRef.current!;
        area.style.height = "0";
        area.style.height = (area.scrollHeight + 2) + "px"; // 2px accounts for border
    };
    useLayoutEffect(updateHeight);
    return (
        <textarea
            ref={textAreaRef}
            className={"TextArea" + (props.className ? ` ${props.className}` : "")}
            onInput={updateHeight}
            style={props.style}
            placeholder={props.placeholder}
            defaultValue={props.value} />
    );
}
