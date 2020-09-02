import React, {CSSProperties} from 'react';
import "./ChipList.sass";
import {AddIcon, CloseIcon} from "../icons/Icons";

export function Chip(props: { onRemove?: () => void, children: React.ReactNode|React.ReactNode[], style?: CSSProperties }) {
    let closeIcon = props.onRemove ? <CloseIcon className="Chip-remove" onClick={props.onRemove} /> : undefined;
    return <div className="Chip" style={props.style}>{props.children}{closeIcon}</div>;
}

export function AddButtonChip(props: { active?: boolean, onClick?: () => void }) {
    return (
        <div
            className={"Chip-iconVariant Chip-add" + (props.active ? " Chip-add-active" : "")}
            onClick={(e) => { props.onClick?.(); e.stopPropagation(); }}>
            <AddIcon />
        </div>
    );
}

export function ChipAddDropdown(props: { children?: React.ReactNode|React.ReactNode[] }) {
    return (
        <div className="ChipAddDropdown" onClick={(e) => e.stopPropagation()}>
            {props.children}
        </div>
    );
}

export function ChipList(props: { onCloseMenu?: () => void, children?: React.ReactNode|React.ReactNode[] }) {
    return (
        <div className="ChipList" onBlur={props.onCloseMenu} onClick={props.onCloseMenu} tabIndex={0}>
            {props.children}
        </div>
    );
}