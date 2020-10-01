import {ArrayVariableType, makeAction, resolveVarType, VariableType} from "./actions";
import React from "react";
import {ActionElement, ActionVarSelector} from "./renderer";


makeAction({
    id: "BaseReadOnlyArray.get",
    output: (action, context) => {
        const thisType = resolveVarType(action.input.this, context);
        return thisType instanceof ArrayVariableType ? thisType.arrayOf : undefined;
    },
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Get element no.
                <ActionVarSelector context={props.context} value={props.action.input.index} type={VariableType.NUMBER} onChange={v => props.onInputChange({index: v})} />
                from
                <ActionVarSelector context={props.context} value={props.action.input.this} type={ArrayVariableType.GENERIC} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});