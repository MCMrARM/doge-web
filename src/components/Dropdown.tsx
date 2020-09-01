import React, {createRef, useEffect, useState} from 'react';
import "./Dropdown.sass";
import {ExpandMoreIcon} from "../icons/Icons";

export function Dropdown(props: { selectedItem: React.ReactNode, children?: React.ReactNode|React.ReactNode[] }) {
    let [expanded, setExpanded] = useState(false);
    let expandedRef = createRef<HTMLDivElement>();
    useEffect(() => {
        if (expanded)
            expandedRef.current?.focus();
    });
    return (
        <div className={"Dropdown" + (expanded ? " Dropdown-expanded" : "")} onClick={() => setExpanded(!expanded)} tabIndex={0} onBlur={() => setExpanded(false)}>
            {props.selectedItem}
            <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
            {expanded && <div ref={expandedRef} className="Dropdown-list">
                {props.children}
            </div>}
        </div>
    );
}

Dropdown.Item = function(props: { selected?: boolean, children: React.ReactNode|React.ReactNode[] }) {
    return (
        <div className={"Dropdown-Item" + (props.selected ? " Dropdown-Item-selected" : "")}>{props.children}</div>
    );
};