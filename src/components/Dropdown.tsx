import React, {createRef, useEffect, useState} from 'react';
import "./Dropdown.sass";
import {ExpandMoreIcon} from "../icons/Icons";

export function Dropdown(props: { selectedItem: React.ReactNode, children?: React.ReactNode|React.ReactNode[] }) {
    let [expanded, setExpanded] = useState(false);
    let expandedRef = createRef<HTMLDivElement>();
    useEffect(() => {
        expandedRef.current?.focus();
    });
    return (
        <div className={"Dropdown" + (expanded ? " Dropdown-expanded" : "")} onClick={() => setExpanded(!expanded)}>
            {props.selectedItem}
            <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
            {expanded && <div ref={expandedRef} className="Dropdown-list" tabIndex={0} onBlur={() => setExpanded(false)}>
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