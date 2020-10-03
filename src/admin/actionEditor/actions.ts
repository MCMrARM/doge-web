import React from "react";

export class VariableType {
    static STRING = new VariableType("string");
    static NUMBER = new VariableType("number");

    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
export class SetVariableType extends VariableType {
    children: { [name: string]: VariableType };
    showFlattened: boolean;

    constructor(name: string, children: { [name: string]: VariableType }, showFlattened: boolean = false) {
        super(name);
        this.children = children;
        this.showFlattened = showFlattened;
    }
}
export class ArrayVariableType extends VariableType {
    static GENERIC = new ArrayVariableType(undefined);

    arrayOf?: VariableType;

    constructor(arrayOf: VariableType|undefined) {
        super("array");
        this.arrayOf = arrayOf;
    }
}

export class ActionOutputVariableType extends SetVariableType {
    output: VariableType;

    constructor(output: VariableType) {
        super("action", {
            output: output
        }, true);
        this.output = output;
    }
}

export type VariableSource = {
    type: "ref",
    path: string[]
} | {
    type: "number",
    value: number
} | {
    type: "string",
    value: string
} | {
    type: "object",
    object: {
        [name: string]: VariableSource
    }
}


export type CategoryDef = {
    parent?: CategoryDef,
    name: string,
    children?: CategoryDef[],
    actions?: ActionDef[]
}

export const actionCategories: CategoryDef[] = [];

export function makeCategory(category: CategoryDef) {
    if (category.parent) {
        if (!category.parent.children)
            category.parent.children = [];
        category.parent.children.push(category);
    } else {
        actionCategories.push(category);
    }
    return category;
}


export type ActionRenderProps = {
    action: ActionUsage,
    context: {[key: string]: VariableType},
    onInputChange: (changes: { [name: string]: VariableSource|null }) => void,
    onBlockChange: (changes: { [name: string]: ActionUsage[]|null }) => void,
    path: [string, number][]
}
export type ActionDef = {
    id: string,
    name: string,
    category: CategoryDef,
    assignNo?: boolean,
    output?: (action: ActionUsage, context: {[key: string]: VariableType}) => VariableType | undefined,
    render: React.ComponentType<ActionRenderProps>
}

export const actions: {[id: string]: ActionDef} = {};

export function makeAction(action: ActionDef) {
    actions[action.id] = action;
    if (action.category) {
        if (!action.category.actions)
            action.category.actions = [];
        action.category.actions.push(action);
    }
}


export type ActionUsage = {
    ref: string,
    action: ActionDef,
    input: { [name: string]: VariableSource },
    blocks?: { [name: string]: ActionUsage[] }
}
export type ActionWorkflow = {
    root: ActionUsage[],
    numberedActionMap: {[key: string]: number},
    reverseNumberedActionMap: {[key: number]: string}
}

export function resolveVarType(source: VariableSource|undefined, context: {[key: string]: VariableType}): VariableType|null {
    if (!source)
        return null;
    if (source.type === "ref") {
        let ent: VariableType = new SetVariableType("internal", context);
        for (const p of source.path) {
            if (!(ent instanceof SetVariableType))
                return null;
            ent = ent.children[p];
        }
        return ent;
    } else if (source.type === "number") {
        return VariableType.NUMBER;
    } else if (source.type === "string") {
        return VariableType.STRING;
    }
    return null;
}

export function checkVarTypesCompatible(a: VariableType, b: VariableType): boolean {
    if (a instanceof ArrayVariableType && b instanceof ArrayVariableType)
        return a.arrayOf === undefined || b.arrayOf === undefined || checkVarTypesCompatible(a.arrayOf, b.arrayOf);
    return a.name === b.name;
}

export function checkVarTypeContainsType(container: VariableType, what: VariableType) {
    if (checkVarTypesCompatible(container, what))
        return true;
    if (container instanceof SetVariableType) {
        for (const k of Object.keys(container.children))
            if (checkVarTypeContainsType(container.children[k], what))
                return true;
    }
    return false;
}

export function sourceToUserDisplayedRefText(workflow: ActionWorkflow|null, src: VariableSource) {
    if (src.type === "number") {
        return src.value.toString();
    } else if (src.type === "string") {
        if (src.value.startsWith("@"))
            return "@" + src.value;
        return src.value;
    } else if (src.type === "ref" && src.path.length > 0) {
        if (src.path[0] === "args")
            return "@" + src.path.slice(1).join(".");
        const renamedFirstComponent = workflow?.numberedActionMap[src.path[0]] || src.path[0];
        return "@" + [renamedFirstComponent, ...src.path.slice(1)].join(".");
    } else if (src.type === "ref") {
        return "@";
    }
    return "?" + src.type + "?";
}

export function userDisplayedRefTextToSource(workflow: ActionWorkflow|null, str: string): VariableSource {
    if (str.startsWith("@")) {
        if (str.startsWith("@@"))
            return {type: "string", value: str.substr(1)};
        const path = str.substr(1).split(".");
        path[0] = workflow?.reverseNumberedActionMap[parseInt(path[0])] || path[0];
        return {type: "ref", path: path};
    }
    return {type: "string", value: str};
}

export function parseStringFormatVarNames(format: string) {
    const ret = new Set<string>();
    for (let i = 0; i < format.length; i++) {
        if (format.charAt(i) === '{') {
            let start = i;
            for (; i < format.length; i++)
                if (format.charAt(i) === '}')
                    break;
            if (format.charAt(i) === '}')
                ret.add(format.substr(start + 1, i - start - 1));
        }
        if (format.charAt(i) === '\\')
            ++i;
    }
    return ret;
}

export type ActionItemPath = [string, number][]

export function getSharedActionItemPathPart(a: [string, number][], b: [string, number][]) {
    const m = Math.min(a.length, b.length);
    for (let i = 0; ; ++i) {
        if (i === m || a[i][0] !== b[i][0] || a[i][1] !== b[i][1])
            return i;
    }
}


// returns [modifiable node]
export function rewriteBlocksAtPath(root: {[name: string]: ActionUsage[]}, path: ActionItemPath): {[name: string]: ActionUsage[]} {
    let current: {[name: string]: ActionUsage[]} = root;
    for (const el of path) {
        const newEdit = {...current[el[0]][el[1]]};
        newEdit.blocks = {...newEdit.blocks};
        current[el[0]] = [...current[el[0]]];
        current[el[0]][el[1]] = newEdit;
        current = newEdit.blocks;
    }
    return current;
}

// returns [new root, deleted element]
export function deleteActionItemAtPath(root: {[name: string]: ActionUsage[]}, path: ActionItemPath): ActionUsage {
    const last = rewriteBlocksAtPath(root, path.slice(0, path.length - 1));
    const pathLast = path[path.length - 1];
    const deleted = last[pathLast[0]][pathLast[1]];
    last[pathLast[0]] = [...last[pathLast[0]].slice(0, pathLast[1]), ...last[pathLast[0]].slice(pathLast[1] + 1)];
    return deleted;
}

export function createActionItemAtPath(root: {[name: string]: ActionUsage[]}, path: ActionItemPath, what: ActionUsage) {
    const last = rewriteBlocksAtPath(root, path.slice(0, path.length - 1));
    const pathLast = path[path.length - 1];
    last[pathLast[0]] = [...last[pathLast[0]].slice(0, pathLast[1]), what, ...last[pathLast[0]].slice(pathLast[1])];
}

export function moveActionItem(root: {[name: string]: ActionUsage[]}, from: ActionItemPath, to: ActionItemPath): ActionItemPath {
    let sharedI = getSharedActionItemPathPart(from, to);
    if (sharedI === from.length)
        return from;
    if (sharedI === to.length)
        --sharedI;

    const last = rewriteBlocksAtPath(root, from.slice(0, sharedI));
    const deleted = deleteActionItemAtPath(last, from.slice(sharedI));
    if (to.length !== from.length && to[sharedI] && to[sharedI][0] === from[sharedI][0] && to[sharedI][1] > from[sharedI][1]) {
        to = [...to];
        --to[sharedI][1];
        createActionItemAtPath(last, to.slice(sharedI), deleted);
        return to;
    } else {
        createActionItemAtPath(last, to.slice(sharedI), deleted);
        return to;
    }
}

const actionBlockOrder = ["condition", "then", "else"];
export function isActionItemBelow(what: ActionItemPath, comparedTo: ActionItemPath) {
    for (let i = 0; i < Math.min(what.length, comparedTo.length); ++i) {
        const whatBlockIdx = actionBlockOrder.indexOf(what[i][0]);
        const comparedToBlockIdx = actionBlockOrder.indexOf(comparedTo[i][0]);
        if (whatBlockIdx !== comparedToBlockIdx)
            return whatBlockIdx > comparedToBlockIdx;
        if (what[i][1] !== comparedTo[i][1])
            return what[i][1] > comparedTo[i][1];
    }
    return what.length > comparedTo.length;
}

export function parseActions() {
    //
}