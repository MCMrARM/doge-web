import {ActionRenderProps, ArrayVariableType, makeAction, makeCategory, resolveVarType, VariableType} from "./actions";
import React, {useContext} from "react";
import {ActionElement, ActionRenderer, ActionVarSelector, WorkflowContext} from "./renderer";
import "./defaultActions.sass";

const scriptingCategory = makeCategory({
    name: "Scripting"
});

const arrayCategory = makeCategory({
    parent: scriptingCategory,
    name: "Arrays"
});

function IfComponent(props: ActionRenderProps) {
    const workflow = useContext(WorkflowContext);
    return (
        <React.Fragment>
            <ActionRenderer initialContext={props.context} workflow={workflow!} actions={props.action.blocks?.condition || []} onChange={v => props.onBlockChange({condition: v})} />
            <div className="ActionConditional">
                <span className="ActionConditional-header">Then</span>
                <ActionRenderer initialContext={props.context} workflow={workflow!} actions={props.action.blocks?.then || []} onChange={v => props.onBlockChange({then: v})} />
                <span className="ActionConditional-header">Else</span>
                <ActionRenderer initialContext={props.context} workflow={workflow!} actions={props.action.blocks?.else || []} onChange={v => props.onBlockChange({else: v})} />
            </div>
        </React.Fragment>
    );
}
makeAction({
    id: "ScriptConditional.if",
    name: "Conditional code",
    category: scriptingCategory,
    render: IfComponent
});

makeAction({
    id: "BaseReadOnlyArray.get",
    name: "Get item from array",
    category: arrayCategory,
    output: (action, context) => {
        const thisType = resolveVarType(action.input.this, context);
        return thisType instanceof ArrayVariableType ? thisType.arrayOf : undefined;
    },
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Get item no.
                <ActionVarSelector context={props.context} value={props.action.input.index} type={VariableType.NUMBER} onChange={v => props.onInputChange({index: v})} />
                from
                <ActionVarSelector context={props.context} value={props.action.input.this} type={ArrayVariableType.GENERIC} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});

makeAction({
    id: "BaseReadOnlyArray.randomItem",
    name: "Get random item from array",
    category: arrayCategory,
    output: (action, context) => {
        const thisType = resolveVarType(action.input.this, context);
        return thisType instanceof ArrayVariableType ? thisType.arrayOf : undefined;
    },
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Get random element from
                <ActionVarSelector context={props.context} value={props.action.input.this} type={ArrayVariableType.GENERIC} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});