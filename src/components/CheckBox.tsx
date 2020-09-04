import React from "react";
import "./CheckBox.sass";

export function CheckBox(props: { value: boolean, children?: React.ReactNode|React.ReactNode[], onChange?: (value: boolean) => void }) {
    let checkSvg = undefined;
    if (props.value)
        checkSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
            <path d="M 17.99,9 16.58,7.58 9.99,14.17 7.41,11.6 5.99,13.01 9.99,17 Z" />
        </svg>;
    return (
        <div className={"CheckBox" + (props.value ? " CheckBox-checked" : "")} tabIndex={0} onClick={() => props.onChange?.(!props.value)}><span className="CheckBox-check">{checkSvg}</span>{props.children}</div>
    );
}