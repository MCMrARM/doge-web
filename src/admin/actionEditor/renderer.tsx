import {
    ActionOutputVariableType,
    ActionUsage,
    ActionWorkflow, checkVarTypeContainsType,
    SetVariableType,
    VariableSource,
    VariableType
} from "./actions";
import React, {createContext, ReactNode, useContext, useState} from "react";
import "./renderer.sass";

const WorkflowContext = createContext<ActionWorkflow|null>(null);

export function ActionRenderer(props: {initialContext: {[name: string]: VariableType}, workflow: ActionWorkflow}) {
    const actions = [];
    let context: {[name: string]: VariableType} = {...props.initialContext};
    for (const action of props.workflow.root) {
        actions.push(<action.action.render key={action.ref} action={action} context={context} onInputChange={() => {}} />);
        if (action.ref && action.action.output) {
            const out = action.action.output(action, context);
            if (out)
                context = {...context, [action.ref]: new ActionOutputVariableType(out)};
        }
    }
    return <WorkflowContext.Provider value={props.workflow}>
        {actions}
    </WorkflowContext.Provider>
}

export function ActionElement(props: {action: ActionUsage, children: React.ReactNode[]}) {
    const context = useContext(WorkflowContext);
    const no = context?.numberedActionMap[props.action.ref];
    return (
        <div className="ActionElement">
            {no && <div className="ActionElement-no">{no}</div>}
            {props.children}
        </div>
    );
}

function ActionVarListLevel(props: {workflow: ActionWorkflow|null, level: {[name: string]: VariableType}, selected: string[], expectedType: VariableType, firstLevel: boolean}) {
    const createItems = (from: {[name: string]: VariableType}, path: string[], arr: ReactNode[], selected: boolean) => {
        for (const k of Object.keys(from)) {
            let v = from[k];
            const kSelected = selected && props.selected[path.length] === k;
            if (v instanceof SetVariableType && v.showFlattened) {
                createItems(v.children, [...path, k], arr, kSelected);
            } else if (kSelected || checkVarTypeContainsType(v, props.expectedType)) {
                let content: ReactNode;
                if (props.firstLevel && path.length > 0) {
                    let origin;
                    if (path[0] === "args") {
                        origin = "@";
                    } else {
                        origin = props.workflow?.numberedActionMap[path[0]] || path[0];
                    }

                    content = <React.Fragment><span className="ActionVarList-origin">{origin}</span> {k}</React.Fragment>;
                } else {
                    content = k;
                }
                arr.push(<li key={path.join("/") + "/" + k} className={"ActionVarList-item" + (kSelected ? " selected" : "")}>{content}</li>);
            }
        }
    };
    const ret: ReactNode[] = [];
    createItems(props.level, [], ret, true);
    if (ret.length === 0)
        return null;
    return (
        <ul className="ActionVarList-items">
            {ret}
        </ul>
    )
}

export function ActionVarList(props: {context: {[name: string]: VariableType}, value: VariableSource, type: VariableType, onChange: (value: VariableSource) => void}) {
    const context = useContext(WorkflowContext);
    const levels: [{[name: string]: VariableType}, string[]][] = [];
    if (props.value.type === "ref") {
        levels.push([props.context, props.value.path]);
        let checkLevel: { [name: string]: VariableType } = props.context;
        let levelNo = 0;
        for (const v of props.value.path) {
            if (v in checkLevel) {
                let newL = checkLevel[v];
                if (newL instanceof SetVariableType) {
                    checkLevel = newL.children;
                    if (!newL.showFlattened)
                        levels.push([checkLevel, props.value.path.slice(levelNo + 1)]);
                }
            } else {
                break;
            }
            ++levelNo;
        }
    } else {
        levels.push([props.context, []]);
    }

    return (
        <div className="ActionVarList">
            <input className="ActionVarList-input" type="text" value={props.value.type} />
            <div className="ActionVarList-itemsCtr">
                {levels.map((x, i) => <ActionVarListLevel workflow={context} key={"level-" + i} level={x[0]} selected={x[1]} expectedType={props.type} firstLevel={i === 0} />)}
            </div>
        </div>
    )
}

export function ActionVarSelector(props: {context: {[name: string]: VariableType}, value: VariableSource, type: VariableType, onChange: (value: VariableSource) => void}) {
    const [open, setOpen] = useState(false);

    const context = useContext(WorkflowContext);
    let content: ReactNode|ReactNode[] = "(unset)";
    if (props.value.type === "number") {
        content = props.value.value;
    } else if (props.value.type === "string") {
        content = props.value.value;
    } else if (props.value.type === "ref" && props.value.path.length > 1) {
        let origin;
        if (props.value.path[0] === "args") {
            origin = "@";
        } else {
            origin = context?.numberedActionMap[props.value.path[0]] || props.value.path[0];
        }
        content = <React.Fragment>
            <div className="ActionVarSelector-origin">{origin}</div>
            {props.value.path.slice(1).join("'s ")}
        </React.Fragment>;
    }

    return (
        <div className="ActionVarSelector" onClick={() => setOpen(true)}>
            {content}

            {open && <ActionVarList context={props.context} value={props.value} type={props.type} onChange={props.onChange} />}
        </div>
    );
}