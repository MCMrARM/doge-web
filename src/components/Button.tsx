import React from "react";
import "./Button.sass";

export function Button(props: { theme?: "secondary", children?: React.ReactNode|React.ReactNode[] }) {
    return (
        <div className={"Button" + (props.theme ? ` Button-${props.theme}` : "")} tabIndex={0}>{props.children}</div>
    );
}