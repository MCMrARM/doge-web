import {ArrayVariableType, makeAction, makeCategory, SetVariableType, VariableType} from "./actions";
import {ActionElement, ActionVarSelector, renderVariableTypeDefault, RenderVariableTypeProps, RenderConstListProps} from "./renderer";
import React, {createContext, useContext} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {colorIntToHexString} from "../../colorUtil";

export const ActionGuildContext = createContext<ServerInfo | null>(null);

const discordCategory = makeCategory({
    name: "Discord"
});

const memberCategory = makeCategory({
    parent: discordCategory,
    name: "Member"
});

const RoleVariableType = new VariableType("role");

export const GuildVariableType = new SetVariableType("guild", {
    members: new VariableType("members")
});

export const MemberVariableType = new SetVariableType("member", {
    displayName: VariableType.STRING
});

GuildVariableType.children["members"] = new ArrayVariableType(MemberVariableType);


function RoleValueComponent(props: RenderVariableTypeProps) {
    const guildContext = useContext(ActionGuildContext);
    if (guildContext && props.value.type === "string") {
        if (props.value.value in guildContext.roles) {
            return <React.Fragment>{guildContext.roles[props.value.value].name}</React.Fragment>;
        }
    }
    return renderVariableTypeDefault(props);
}

function RoleConstListComponent(props: RenderConstListProps) {
    const guildContext = useContext(ActionGuildContext);
    const selectedId = props.value.type === "string" ? props.value.value : null;
    return (
        <ul className="ActionVarList-items" style={{width: "140px"}}>
            {guildContext && Object.values(guildContext.roles).sort((a, b) => b.position - a.position).map(x => (
                <li key={x.id}
                    className={"ActionVarList-item" + (selectedId === x.id ? " selected" : "")}
                    style={{color: colorIntToHexString(x.color)}}
                    onClick={() => props.onChange({type: "string", value: x.id})}>
                    {x.name}
                </li>
            ))}
        </ul>
    )
}

makeAction({
    id: "GuildMember.addRole",
    name: "Add role",
    category: memberCategory,
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Add role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} valueComponent={RoleValueComponent} constListComponent={RoleConstListComponent} onChange={v => props.onInputChange({role: v})} />
                to
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});
makeAction({
    id: "GuildMember.removeRole",
    name: "Remove role",
    category: memberCategory,
    render: (props) => {
        return (
            <ActionElement action={props.action}>
                Remove role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} onChange={v => props.onInputChange({role: v})} />
                to
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});