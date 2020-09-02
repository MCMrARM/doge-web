import React from "react";
import "./Button.sass";

export function Button(props: { theme?: "secondary", children?: React.ReactNode|React.ReactNode[], onClick?: () => void }) {
    return (
        <div className={"Button" + (props.theme ? ` Button-${props.theme}` : "")} tabIndex={0} onClick={props.onClick}>{props.children}</div>
    );
}