import React from "react";
import "./Button.sass";

export function Button(props: {
    theme?: "colorless" | "secondary"
} & React.InputHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} type="button" className={"Button" + (props.theme ? ` Button-${props.theme}` : "")} />
    );
}