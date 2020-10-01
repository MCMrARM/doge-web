import {ArrayVariableType, makeAction, resolveVarType, SetVariableType, VariableType} from "./actions";
import {ActionElement, ActionVarSelector} from "./renderer";
import React from "react";

const RoleVariableType = new VariableType("role");

export const GuildVariableType = new SetVariableType("guild", {
    members: new VariableType("members")
});

export const MemberVariableType = new SetVariableType("member", {
    displayName: VariableType.STRING
});

GuildVariableType.children["members"] = new ArrayVariableType(MemberVariableType);


makeAction({
    id: "GuildMember.addRole",
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Add role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} onChange={v => props.onInputChange({index: v})} />
                to
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});
makeAction({
    id: "GuildMember.removeRole",
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Remove role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} onChange={v => props.onInputChange({index: v})} />
                to
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});