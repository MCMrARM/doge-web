import React from 'react';
import "./ChipList.sass";
import {AddIcon, CloseIcon} from "../icons/Icons";

export function Chip(props: { onRemove?: () => void, children: React.ReactNode|React.ReactNode[] }) {
    let closeIcon = props.onRemove ? <CloseIcon className="Chip-remove" onClick={props.onRemove} /> : undefined;
    return <div className="Chip">{props.children}{closeIcon}</div>;
}

export function ChipList(props: { children?: React.ReactNode|React.ReactNode[] }) {
    return (
        <div className="ChipList">
            {props.children}
            <div className="Chip-iconVariant"><AddIcon /></div>
        </div>
    );
}