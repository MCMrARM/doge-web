import React, {CSSProperties, useState} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {Dropdown} from "../../components/Dropdown";

export function ChannelDropdown(props: {value: string|null, server: ServerInfo, onValueChanged: (val: string) => void, style?: CSSProperties}) {
    let formatChannel = (id: string) => "#" + (props.server.channels[id]?.name || id);

    let items = undefined;
    let [expanded, setExpanded] = useState(false);
    if (expanded) {
        items = Object.values(props.server.channels).sort((a, b) => a.name.localeCompare(b.name)).map(x => (
            <Dropdown.Item key={x.id} onClick={() => props.onValueChanged(x.id)}>{`#${x.name}`}</Dropdown.Item>
        ));
    }
    return (
        <Dropdown selectedItem={props.value ? formatChannel(props.value) : "Unset"} expanded={expanded} onSetExpanded={setExpanded} style={props.style}>
            {items}
        </Dropdown>
    );
}