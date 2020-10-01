import {ArrayVariableType, makeAction, makeCategory, resolveVarType, VariableType} from "./actions";
import React from "react";
import {ActionElement, ActionVarSelector} from "./renderer";

const scriptingCategory = makeCategory({
    name: "Scripting"
});

const arrayCategory = makeCategory({
    parent: scriptingCategory,
    name: "Arrays"
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