import React, {CSSProperties, ReactNode, useState} from "react";
import {Dropdown} from "../../components/Dropdown";

export function SimpleDropdown<T>(props: {value: T, map: Map<T, ReactNode>, onValueChanged: (value: T) => void, style?: CSSProperties}) {
    let [expanded, setExpanded] = useState(false);
    let items = null;
    if (expanded) {
        items = Array.from(props.map.entries()).map(([k, v], i) => (
            <Dropdown.Item key={"item-" + i} selected={props.value === k} onClick={() => props.onValueChanged(k)}>{v}</Dropdown.Item>
        ));
    }

    return (
        <Dropdown selectedItem={props.map.get(props.value)} expanded={expanded} onSetExpanded={setExpanded} style={props.style}>
            {items}
        </Dropdown>
    );
}