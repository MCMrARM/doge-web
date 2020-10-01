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
    arrayOf: VariableType;

    constructor(arrayOf: VariableType) {
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
    type: "object",
    object: {
        [name: string]: VariableSource
    }
}


export type ActionDef = {
    id: string,
    assignNo?: boolean,
    output?: (action: ActionUsage, context: {[key: string]: VariableType}) => VariableType | undefined,
    render: (props: { action: ActionUsage, context: {[key: string]: VariableType}, onInputChange: (changes: { [name: string]: VariableSource|null }) => void }) => JSX.Element
}

export const actions: {[id: string]: ActionDef} = {};

export function makeAction(action: ActionDef) {
    actions[action.id] = action;
}


export type ActionUsage = {
    ref: string,
    action: ActionDef,
    input: { [name: string]: VariableSource },
    condition?: ActionUsage[],
    blocks?: { [name: string]: ActionUsage[] }
}
export type ActionWorkflow = {
    root: ActionUsage[],
    numberedActionMap: {[key: string]: number}
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
    }
    return null;
}

export function checkVarTypesCompatible(a: VariableType, b: VariableType): boolean {
    if (a instanceof ArrayVariableType && b instanceof ArrayVariableType)
        return checkVarTypesCompatible(a.arrayOf, b.arrayOf);
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

export function parseActions() {
    //
}