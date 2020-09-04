import React, {CSSProperties, ReactNode, useState} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {Dropdown} from "../../components/Dropdown";
import {colorIntToHexString} from "../../util";

export function RoleDropdown(props: {value: string|null, server: ServerInfo, onValueChanged: (val: string) => void, placeholder?: ReactNode, style?: CSSProperties}) {
    let items = undefined;
    let [expanded, setExpanded] = useState(false);
    if (expanded) {
        items = Object.values(props.server.roles).sort((a, b) => b.position - a.position).map(x => (
            <Dropdown.Item key={x.id} onClick={() => props.onValueChanged(x.id)} selected={x.id === props.value} style={{color: colorIntToHexString(x.color || 0xFFFFFF)}}>{x.name}</Dropdown.Item>
        ));
    }
    let createSelectedItem = (value: string) => <span style={{color: colorIntToHexString(props.server.roles[value]?.color || 0xFFFFFF)}}>{props.server.roles[value]?.name}</span>;
    return (
        <Dropdown selectedItem={props.value ? createSelectedItem(props.value) : (props.placeholder || "Unset")} expanded={expanded} onSetExpanded={setExpanded} style={props.style}>
            {items}
        </Dropdown>
    );
}