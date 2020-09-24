import React, {forwardRef} from "react";
import "./Button.sass";

export const Button = forwardRef((props: {
    theme?: "colorless" | "secondary" | "colorless icon" | "secondary icon"
} & React.InputHTMLAttributes<HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
    let themeClasses = ["Button", ...props.theme?.split(" ").map(x => "Button-" + x) || []];
    return (
        <button ref={ref} {...props} type="button" className={themeClasses.join(" ") + (props.className ? ` ${props.className}` : "")} />
    );
});