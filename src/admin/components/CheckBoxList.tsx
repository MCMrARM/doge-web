import {CheckBox} from "../../components/CheckBox";
import React, {CSSProperties} from "react";
import "./CheckBoxList.sass";

export function CheckBoxList(props: {value: string[], map: {[key: string]: string}, onChange: (value: string[]) => void, style?: CSSProperties}) {
    let valueSet = new Set(props.value);
    let setValue = (key: string, value: boolean) => {
        if (valueSet.has(key) !== value) {
            if (value)
                props.onChange([...props.value, key]);
            else
                props.onChange(props.value.filter(x => x !== key));
        }
    };
    let checkBoxes = Object.entries(props.map).map(([k, v]) => <CheckBox value={valueSet.has(k)} onChange={(v) => setValue(k, v)}>{v}</CheckBox>);
    return (
        <div className="CheckBoxList" style={props.style}>
            {checkBoxes}
        </div>
    );
}