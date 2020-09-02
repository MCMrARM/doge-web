import React, {ReactNode, useState} from "react";
import {Dropdown} from "../../components/Dropdown";

export function SimpleDropdown<T>(props: {value: T, map: Map<T, ReactNode>, onValueChanged: (value: T) => void}) {
    let [expanded, setExpanded] = useState(false);
    let items = Array.from(props.map.entries()).map(([k, v]) => (
        <Dropdown.Item selected={props.value === k} onClick={() => props.onValueChanged(k)}>{v}</Dropdown.Item>
    ));

    return (
        <Dropdown selectedItem={props.map.get(props.value)} expanded={expanded} onSetExpanded={setExpanded}>
            {items}
        </Dropdown>
    );
}