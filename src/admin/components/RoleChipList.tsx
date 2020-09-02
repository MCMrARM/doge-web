import React, {useState} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {AddButtonChip, Chip, ChipAddDropdown, ChipList} from "../../components/ChipList";
import {Dropdown} from "../../components/Dropdown";
import {colorIntToHexString} from "../../util";

export function RoleChipList(props: {value: string[], server: ServerInfo, onValueChanged: (val: string[]) => void}) {
    let chips = [];
    for (let i = 0; i < props.value.length; i++) {
        let id = props.value[i];
        let name = (props.server.roles[id]?.name || id);
        let color = colorIntToHexString(props.server.roles[id]?.color || 0xFFFFFF);
        let onRemove = () => {
            props.onValueChanged([...props.value.slice(0, i), ...props.value.slice(i + 1)]);
        };
        chips.push(<Chip key={id} onRemove={onRemove} style={{border: `1px solid ${color}`, color: color}}>{name}</Chip>)
    }
    let addDropdown = undefined;
    let [expanded, setExpanded] = useState(false);
    if (expanded) {
        let valueSet = new Set(props.value);
        let onClick = (id: string) => {
            props.onValueChanged(props.value.concat([id]));
        };
        let channels = Object.values(props.server.roles).filter(x => !valueSet.has(x.id)).sort((a, b) => b.position - a.position).map(x => (
            <Dropdown.Item onClick={() => onClick(x.id)} style={{color: colorIntToHexString(x.color || 0xFFFFFF)}}>{`${x.name}`}</Dropdown.Item>
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