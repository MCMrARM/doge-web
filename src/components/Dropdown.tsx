import React, {createRef, CSSProperties, useEffect, useState} from 'react';
import "./Dropdown.sass";
import {ExpandMoreIcon} from "../icons/Icons";

export function Dropdown(props: { expanded?: boolean, selectedItem: React.ReactNode, children?: React.ReactNode|React.ReactNode[], style?: CSSProperties, onSetExpanded?: (expanded: boolean) => void }) {
    let expandedProp = useState(false);
    let [expanded, setExpanded] = props.expanded !== undefined && props.onSetExpanded ? [props.expanded, props.onSetExpanded] : expandedProp;
    let expandedRef = createRef<HTMLDivElement>();
    useEffect(() => {
        if (expanded)
            expandedRef.current?.focus();
    });
    return (
        <div className={"Dropdown" + (expanded ? " Dropdown-expanded" : "")} onClick={() => setExpanded(!expanded)} tabIndex={0} onBlur={() => setExpanded(false)} style={props.style}>
            {props.selectedItem}
            <ExpandMoreIcon className="AdminName-sidebar-server-expand" />
            {expanded && <div ref={expandedRef} className="Dropdown-list">
                {props.children}
            </div>}
        </div>
    );
}

Dropdown.Item = function(props: { selected?: boolean, onClick?: () => void, children: React.ReactNode|React.ReactNode[], style?: CSSProperties }) {
    return (
        <div className={"Dropdown-Item" + (props.selected ? " Dropdown-Item-selected" : "")} onClick={props.onClick} style={props.style}>{props.children}</div>
    );
};