import React from "react";
import {TextArea} from "../../components/TextArea";

export function TextAreaList(props: {value: string[], placeholder: string, onValueChanged: (value: string[]) => void}) {
    let onChange = (i: number, v: string) => {
        let arr = [...props.value];
        arr[i] = v;
        props.onValueChanged(arr);
    };
    let onBlur = (i: number) => {
        if (props.value[i] === "")
            props.onValueChanged([...props.value.slice(0, i), ...props.value.slice(i + 1)]);
    };
    let onAddNew = (v: string) => props.onValueChanged([...props.value, v]);
    let ret = props.value.map((x, i) => <TextArea key={i} value={x} style={{marginBottom: "4px"}} onValueChange={(v) => onChange(i, v)} onBlur={() => onBlur(i)} />);
    ret.push(<TextArea value="" key={props.value.length} placeholder={props.placeholder} onValueChange={onAddNew} />);
    return <div>{ret}</div>;
}