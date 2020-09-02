import React from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {Chip, ChipList} from "../../components/ChipList";

export function ChannelChipList(props: {value: string[], server: ServerInfo, onValueChanged: (val: string[]) => void}) {
    let chips = [];
    for (let i = 0; i < props.value.length; i++) {
        let id = props.value[i];
        let name = "#" + (props.server.channels[id]?.name || id);
        let onRemove = () => {
            props.onValueChanged([...props.value.slice(0, i), ...props.value.slice(i + 1)]);
        };
        chips.push(<Chip onRemove={onRemove}>{name}</Chip>)
    }
    return (
        <ChipList>
            {chips}
        </ChipList>
    );
}