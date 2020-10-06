import {
    actionCategories,
    ActionOutputVariableType,
    ActionUsage,
    ActionWorkflow, CategoryDef, checkVarTypeContainsType, moveActionItem, parseStringFormatVarNames,
    SetVariableType, sourceToUserDisplayedRefText, userDisplayedRefTextToSource,
    VariableSource,
    VariableType
} from "./actions";
import React, {createContext, ReactNode, RefObject, useContext, useRef, useState} from "react";
import "./renderer.sass";
import {TextArea} from "../../components/TextArea";
import {DragContext, DragDropCallback, DragItem} from "./dragHelper";

export const WorkflowContext = createContext<ActionWorkflow|null>(null);

export function ActionRenderer(props: {initialContext: {[name: string]: VariableType}, workflow: ActionWorkflow, actions?: ActionUsage[], onChange: (newActions: ActionUsage[]) => void, path?: [[string, number][], string]}) {
    const inActions = props.actions || props.workflow.root;
    const actions = [];
    let context: {[name: string]: VariableType} = {...props.initialContext};
    const changeItem = (i: number, k: "input" | "blocks", v: { [name: string]: any }) => {
        const newArray = [...inActions];
        const newValue = {...newArray[i][k] || {}};
        for (const key of Object.keys(v)) {
            const value = v[key];
            if (value !== null)
                newValue[key] = value;
            else
                delete newValue[key];
        }
        newArray[i] = {...newArray[i], [k]: newValue};
        props.onChange(newArray);
    };
    const pathBase = props.path ? props.path[0] : [];
    for (let i = 0; i < inActions.length; i++) {
        const action = inActions[i];
        actions.push(
            <action.action.render
                key={action.ref}
                action={action}
                context={context}
                onInputChange={v => changeItem(i, "input", v)}
                onBlockChange={v => changeItem(i, "blocks", v)}
                path={[...pathBase, [props.path?.[1] || "", i]]} />
        );
        if (action.ref && action.action.output) {
            const out = action.action.output(action, context);
            if (out)
                context = {...context, [action.ref]: new ActionOutputVariableType(out)};
        }
    }
    if (actions.length === 0) {
        actions.push(<NoActionElement key={"nothing"} path={[...pathBase, [props.path?.[1] || "", 0]]} />);
    }
    if (props.path) {
        return <React.Fragment>{actions}</React.Fragment>;
    } else {
        const dropItem: DragDropCallback = (from, to, pos) => {
            const tmpRoot = {"": inActions};
            if (pos === "below") {
                to = [...to];
                ++to[to.length - 1][1];
            }
            moveActionItem(tmpRoot, from, to);
            props.onChange(tmpRoot[""]);
        };
        return <WorkflowContext.Provider value={props.workflow}>
            <DragContext onDrop={dropItem}>
                {actions}
            </DragContext>
        </WorkflowContext.Provider>
    }
}

export function ActionElement(props: {action: ActionUsage, path?: [string, number][], children: React.ReactNode[]}) {
    const context = useContext(WorkflowContext);
    const no = context?.numberedActionMap[props.action.ref];

    return (
        <DragItem dragKey={(props.path || []).flatMap(x => x).join("-")} data={props.path || []} placeholderClassName="ActionElement-dragPlaceholder">
            {(provided) => (
                <div className="ActionElement" ref={provided.ref as RefObject<HTMLDivElement>} style={provided.dragStyle} {...provided.events}>
                    {no && <div className="ActionElement-no">{no}</div>}
                    <div className="ActionElement-content">
                        {props.children}
                    </div>
                </div>
            )}
        </DragItem>
    );
}

function NoActionElement(props: {path: [string, number][]}) {
    return (
        <DragItem dragKey={(props.path || []).flatMap(x => x).join("-") + "-NONE"} data={props.path} placeholderClassName="ActionElement-dragPlaceholder" positions={["above"]}>
            {(provided) => provided.droppingOver ? (
                <div ref={provided.ref as RefObject<HTMLDivElement>} />
            ) : (
                <div ref={provided.ref as RefObject<HTMLDivElement>} className="ActionElement-doNothing">
                    Do nothing
                </div>
            )}
        </DragItem>
    );
}

export function ConditionActionElement(props: {action: ActionUsage, path?: [string, number][], children: React.ReactNode[]}) {
    return <ActionElement action={props.action} path={props.path}>
        If
        {props.children}
    </ActionElement>;
}

function ActionVarListLevel(props: {workflow: ActionWorkflow|null, level: {[name: string]: VariableType}, globalPath: string[], selected: string[], expectedType: VariableType, firstLevel: boolean, hasConst: boolean, onChange: (value: VariableSource) => void}) {
    const createItems = (from: {[name: string]: VariableType}, path: string[], arr: ReactNode[], selected: boolean) => {
        for (const k of Object.keys(from)) {
            let v = from[k];
            const kSelected = selected && props.selected[props.globalPath.length + path.length] === k;
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
                arr.push(
                    <li key={path.join("/") + "/" + k}
                        onClick={() => props.onChange({type: "ref", path: props.globalPath.concat(path).concat([k])})}
                        className={"ActionVarList-item" + (kSelected ? " selected" : "")}>
                        {content}
                    </li>);
            }
        }
    };
    const ret: ReactNode[] = [];
    if (props.hasConst) {
        ret.push(
            <li key={"const"}
                onClick={() => props.onChange({type: "string", value: ""})}
                className={"ActionVarList-item" + (props.selected.length === 0 ? " selected" : "")}>
                <span className="ActionVarList-origin">C</span>
                Constant
            </li>
        );
    }
    createItems(props.level, [], ret, true);
    if (ret.length === 0)
        return null;
    return (
        <ul className="ActionVarList-items">
            {ret}
        </ul>
    )
}

export function ActionVarList(props: {context: {[name: string]: VariableType}, value: VariableSource|undefined, type: VariableType, constListComponent?: (props: RenderConstListProps) => JSX.Element, onChange: (value: VariableSource) => void}) {
    const context = useContext(WorkflowContext);
    const levels: [{[name: string]: VariableType}, string[]][] = [];
    if (props.value && props.value.type === "ref") {
        levels.push([props.context, []]);
        let checkLevel: { [name: string]: VariableType } = props.context;
        let levelNo = 0;
        for (const v of props.value.path) {
            if (v in checkLevel) {
                let newL = checkLevel[v];
                if (newL instanceof SetVariableType) {
                    checkLevel = newL.children;
                    if (!newL.showFlattened)
                        levels.push([checkLevel, props.value.path.slice(0, levelNo + 1)]);
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
            <input className="ActionVarList-input" type="text" value={props.value ? sourceToUserDisplayedRefText(context, props.value) : ""} onChange={v => props.onChange(userDisplayedRefTextToSource(context, v.target.value))} />
            <div className="ActionVarList-itemsCtr">
                {levels.map((x, i) => <ActionVarListLevel workflow={context} key={"level-" + i} level={x[0]} globalPath={x[1]} selected={props.value && props.value.type === "ref" ? props.value.path : []} expectedType={props.type} firstLevel={i === 0} hasConst={i === 0 && props.constListComponent !== undefined} onChange={props.onChange} />)}
                {props.constListComponent !== undefined && (!props.value || props.value.type !== "ref" || props.value.path.length === 0) ? <props.constListComponent value={props.value} onChange={props.onChange} /> : null}
            </div>
        </div>
    )
}

export type RenderVariableTypeProps = {workflow: ActionWorkflow|null, value: VariableSource|undefined}

export function renderVariableTypeDefault(props: RenderVariableTypeProps): JSX.Element {
    if (!props.value) {
        return <span>(unset)</span>;
    } else if (props.value.type === "number") {
        return <React.Fragment>{props.value.value.toString()}</React.Fragment>;
    } else if (props.value.type === "string") {
        return <React.Fragment>{props.value.value}</React.Fragment>;
    } else if (props.value.type === "ref" && props.value.path.length > 1) {
        let origin;
        if (props.value.path[0] === "args") {
            origin = "@";
        } else {
            origin = props.workflow?.numberedActionMap[props.value.path[0]] || props.value.path[0];
        }
        return <React.Fragment>
            <div className="ActionVarSelector-origin">{origin}</div>
            {props.value.path.slice(1).join("'s ")}
        </React.Fragment>;
    }
    return <span>(unset)</span>;
}

export type RenderConstListProps = {value: VariableSource|undefined, onChange: (value: VariableSource) => void}

export function ActionVarSelector(props: {context: {[name: string]: VariableType}, value: VariableSource | undefined, type: VariableType, valueComponent?: (props: RenderVariableTypeProps) => JSX.Element, constListComponent?: (props: RenderConstListProps) => JSX.Element, onChange: (value: VariableSource) => void}) {
    const [open, setOpen] = useState(false);

    const workflow = useContext(WorkflowContext);
    const ValueComponent = props.valueComponent || renderVariableTypeDefault;

    return (
        <div className="ActionVarSelector" onClick={() => setOpen(true)}>
            <ValueComponent workflow={workflow} value={props.value} />

            {open && <ActionVarList context={props.context} value={props.value} type={props.type} constListComponent={props.constListComponent} onChange={props.onChange} />}
        </div>
    );
}

export function ActionList(props: {categories?: CategoryDef[]}) {
    const categories = props.categories || actionCategories;
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const flatSelCatList: ReactNode[] = [];
    function createSelCatList(node: CategoryDef, textPath: string) {
        let i = 0;
        for (const child of node.actions || []) {
            flatSelCatList.push(<li key={textPath + "-" + (i++)} className="ActionList-item">{child.name}</li>);
        }
        for (const child of node.children || []) {
            flatSelCatList.push(<li key={textPath + "-" + i} className="ActionList-header">{child.name}</li>);
            createSelCatList(child, textPath + "-" + (i++));
        }
    }
    createSelCatList(categories[selectedCategory], "cat-" + selectedCategory);
    return (
        <div className="ActionList">
            <ul className="ActionList-items">
                {categories.map((x, i) => <li key={"cat-" + i} onClick={() => setSelectedCategory(i)} className={"ActionList-item" + (selectedCategory === i ? " selected" : "")}>{x.name}</li>)}
            </ul>
            <ul className="ActionList-items" style={{width: "auto", flexGrow: 1}}>
                {flatSelCatList}
            </ul>
        </div>
    )
}

export function StringFormatVarEditor(props: {context: {[key: string]: VariableType}, value: VariableSource|undefined, onChange: (value: VariableSource) => void}) {
    let objectValue: { [name: string]: VariableSource } = {};
    if (props.value && props.value.type === "object")
        objectValue = props.value.object;
    let messageStr = objectValue.message && objectValue.message.type === "string" ? objectValue.message.value : "";
    if (props.value && props.value.type === "string")
        messageStr = props.value.value;
    const vars = Array.from(parseStringFormatVarNames(messageStr));
    return (
        <React.Fragment>
            <TextArea
                value={messageStr}
                onChange={v => props.onChange({type: "object", object: {...objectValue, message: {type: "string", value: v}}})}
                style={{width: "100%"}} />
            {vars.length > 0 && "Substitutions:"}
            {vars.map(x => (
                <div key={"var-" + x} className="StringFormatVarEditor-sub">
                    <strong>{`{${x}}`}</strong>
                    <ActionVarSelector
                        context={props.context} type={VariableType.STRING}
                        value={objectValue[x]}
                        onChange={v => props.onChange({type: "object", object: {...objectValue, [x]: v}})} />
                </div>
            ))}
        </React.Fragment>
    )
}