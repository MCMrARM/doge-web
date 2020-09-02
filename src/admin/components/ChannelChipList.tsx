import React, {useState} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {AddButtonChip, Chip, ChipAddDropdown, ChipList} from "../../components/ChipList";
import {Dropdown} from "../../components/Dropdown";

export function ChannelChipList(props: {value: string[], server: ServerInfo, onValueChanged: (val: string[]) => void}) {
    let chips = [];
    for (let i = 0; i < props.value.length; i++) {
        let id = props.value[i];
        let name = "#" + (props.server.channels[id]?.name || id);
        let onRemove = () => {
            props.onValueChanged([...props.value.slice(0, i), ...props.value.slice(i + 1)]);
        };
        chips.push(<Chip key={id} onRemove={onRemove}>{name}</Chip>)
    }
    let addDropdown = undefined;
    let [expanded, setExpanded] = useState(false);
    if (expanded) {
        let valueSet = new Set(props.value);
        let onClick = (id: string) => {
            props.onValueChanged(props.value.concat([id]));
        };
        let channels = Object.values(props.server.channels).filter(x => !valueSet.has(x.id)).sort((a, b) => a.name.localeCompare(b.name)).map(x => (
            <Dropdown.Item onClick={() => onClick(x.id)}>{`#${x.name}`}</Dropdown.Item>
        ));
        addDropdown = <ChipAddDropdown>{channels}</ChipAddDropdown>;
    }
    return (
        <ChipList onCloseMenu={() => setExpanded(false)}>
            {chips}
            <AddButtonChip active={expanded} onClick={() => setExpanded(!expanded)} />
            {addDropdown}
        </ChipList>
    );
}