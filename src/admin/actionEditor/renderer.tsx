import {
    actionCategories,
    ActionOutputVariableType,
    ActionUsage,
    ActionWorkflow, CategoryDef, checkVarTypeContainsType,
    SetVariableType, sourceToUserDisplayedRefText, userDisplayedRefTextToSource,
    VariableSource,
    VariableType
} from "./actions";
import React, {createContext, ReactNode, useContext, useState} from "react";
import "./renderer.sass";

const WorkflowContext = createContext<ActionWorkflow|null>(null);

export function ActionRenderer(props: {initialContext: {[name: string]: VariableType}, workflow: ActionWorkflow, onChange: (newWorkflow: ActionWorkflow) => void}) {
    const actions = [];
    let context: {[name: string]: VariableType} = {...props.initialContext};
    const changeItem = (i: number, v: { [name: string]: VariableSource|null }) => {
        const newArray = [...props.workflow.root];
        newArray[i] = {...newArray[i], input: {...newArray[i].input}};
        for (const key of Object.keys(v)) {
            const value = v[key];
            if (value !== null)
                newArray[i].input[key] = value;
            else
                delete newArray[i].input[key];
        }
        props.onChange({...props.workflow, root: newArray});
    };
    for (let i = 0; i < props.workflow.root.length; i++) {
        const action = props.workflow.root[i];
        actions.push(<action.action.render key={action.ref} action={action} context={context} onInputChange={v => changeItem(i, v)} />);
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

export function ActionVarList(props: {context: {[name: string]: VariableType}, value: VariableSource, type: VariableType, constListComponent?: (props: RenderConstListProps) => JSX.Element, onChange: (value: VariableSource) => void}) {
    const context = useContext(WorkflowContext);
    const levels: [{[name: string]: VariableType}, string[]][] = [];
    if (props.value.type === "ref") {
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
            <input className="ActionVarList-input" type="text" value={sourceToUserDisplayedRefText(context, props.value)} onChange={v => props.onChange(userDisplayedRefTextToSource(context, v.target.value))} />
            <div className="ActionVarList-itemsCtr">
                {levels.map((x, i) => <ActionVarListLevel workflow={context} key={"level-" + i} level={x[0]} globalPath={x[1]} selected={props.value.type === "ref" ? props.value.path : []} expectedType={props.type} firstLevel={i === 0} hasConst={i === 0 && props.constListComponent !== undefined} onChange={props.onChange} />)}
                {props.constListComponent !== undefined && (props.value.type !== "ref" || props.value.path.length === 0) ? <props.constListComponent value={props.value} onChange={props.onChange} /> : null}
            </div>
        </div>
    )
}

export type RenderVariableTypeProps = {workflow: ActionWorkflow|null, value: VariableSource}

export function renderVariableTypeDefault(props: RenderVariableTypeProps): JSX.Element {
    if (props.value.type === "number") {
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
    return <span>"(unset)"</span>;
}

export type RenderConstListProps = {value: VariableSource, onChange: (value: VariableSource) => void}

export function ActionVarSelector(props: {context: {[name: string]: VariableType}, value: VariableSource, type: VariableType, valueComponent?: (props: RenderVariableTypeProps) => JSX.Element, constListComponent?: (props: RenderConstListProps) => JSX.Element, onChange: (value: VariableSource) => void}) {
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