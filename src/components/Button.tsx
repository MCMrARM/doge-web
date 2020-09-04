import React, {CSSProperties} from "react";
import "./Button.sass";

export function Button(props: { theme?: "colorless"|"secondary", children?: React.ReactNode|React.ReactNode[], onClick?: () => void, style?: CSSProperties }) {
    return (
        <div className={"Button" + (props.theme ? ` Button-${props.theme}` : "")} tabIndex={0} style={props.style} onClick={props.onClick}>{props.children}</div>
    );
}