import React from "react";
import "./Button.sass";

export function Button(props: {
    theme?: "colorless" | "secondary" | "colorless icon" | "secondary icon"
} & React.InputHTMLAttributes<HTMLButtonElement>) {
    let themeClasses = ["Button", ...props.theme?.split(" ").map(x => "Button-" + x) || []];
    return (
        <button {...props} type="button" className={themeClasses.join(" ")} />
    );
}