import {ArrayVariableType, makeAction, makeCategory, SetVariableType, VariableType} from "./actions";
import {
    ActionElement,
    ActionVarSelector,
    renderVariableTypeDefault,
    RenderVariableTypeProps,
    RenderConstListProps,
    StringFormatVarEditor, ConditionActionElement
} from "./renderer";
import React, {createContext, useContext} from "react";
import {ServerInfo} from "../../shared/ServerInfo";
import {colorIntToHexString} from "../../colorUtil";
import {DiscordIcon} from "../../icons/Icons";

export const ActionGuildContext = createContext<ServerInfo | null>(null);

const discordCategory = makeCategory({
    name: "Discord",
    renderIcon: () => {
        return <DiscordIcon className="Icon" />
    }
});

const memberCategory = makeCategory({
    parent: discordCategory,
    name: "Member"
});

const channelCategory = makeCategory({
    parent: discordCategory,
    name: "Channel"
});

const RoleVariableType = new VariableType("role");

export const GuildVariableType = new SetVariableType("guild", {
    members: new VariableType("members")
});

export const MemberVariableType = new SetVariableType("member", {
    displayName: VariableType.STRING
});

export const ChannelVariableType = new SetVariableType("channel", {
});

GuildVariableType.children["members"] = new ArrayVariableType(MemberVariableType);


function RoleValueComponent(props: RenderVariableTypeProps) {
    const guildContext = useContext(ActionGuildContext);
    if (guildContext && props.value && props.value.type === "string") {
        if (props.value.value in guildContext.roles) {
            return <React.Fragment>{guildContext.roles[props.value.value].name}</React.Fragment>;
        }
    }
    return renderVariableTypeDefault(props);
}

function RoleConstListComponent(props: RenderConstListProps) {
    const guildContext = useContext(ActionGuildContext);
    const selectedId = props.value && props.value.type === "string" ? props.value.value : null;
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

function ChannelValueComponent(props: RenderVariableTypeProps) {
    const guildContext = useContext(ActionGuildContext);
    if (guildContext && props.value && props.value.type === "string") {
        if (props.value.value in guildContext.channels) {
            return <React.Fragment>#{guildContext.channels[props.value.value].name}</React.Fragment>;
        }
    }
    return renderVariableTypeDefault(props);
}

function ChannelConstListComponent(props: RenderConstListProps) {
    const guildContext = useContext(ActionGuildContext);
    const selectedId = props.value && props.value.type === "string" ? props.value.value : null;
    return (
        <ul className="ActionVarList-items" style={{width: "140px"}}>
            {guildContext && Object.values(guildContext.channels).sort((a, b) => b.name.localeCompare(a.name)).map(x => (
                <li key={x.id}
                    className={"ActionVarList-item" + (selectedId === x.id ? " selected" : "")}
                    onClick={() => props.onChange({type: "string", value: x.id})}>
                    {"#" + x.name}
                </li>
            ))}
        </ul>
    )
}

makeAction({
    id: "GuildMember.hasRole",
    name: "Has role",
    category: memberCategory,
    render: (props) => {
        return (
            <ConditionActionElement action={props.action} path={props.path}>
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
                has role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} valueComponent={RoleValueComponent} constListComponent={RoleConstListComponent} onChange={v => props.onInputChange({role: v})} />
            </ConditionActionElement>
        );
    }
});

makeAction({
    id: "GuildMember.addRole",
    name: "Add role",
    category: memberCategory,
    render: (props) => {
        return (
            <ActionElement action={props.action} path={props.path}>
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
            <ActionElement action={props.action} path={props.path}>
                Remove role
                <ActionVarSelector context={props.context} value={props.action.input.role} type={RoleVariableType} valueComponent={RoleValueComponent} constListComponent={RoleConstListComponent} onChange={v => props.onInputChange({role: v})} />
                to
                <ActionVarSelector context={props.context} value={props.action.input.this} type={MemberVariableType} onChange={v => props.onInputChange({this: v})} />
            </ActionElement>
        );
    }
});

makeAction({
    id: "TextChannel.send",
    name: "Send message",
    category: channelCategory,
    render: (props) => {
        return (
            <ActionElement action={props.action} path={props.path}>
                Send message to channel
                <ActionVarSelector context={props.context} value={props.action.input.this} type={ChannelVariableType} valueComponent={ChannelValueComponent} constListComponent={ChannelConstListComponent} onChange={v => props.onInputChange({this: v})} />
                <StringFormatVarEditor context={props.context} value={props.action.input.message} onChange={v => props.onInputChange({message: v})} />
            </ActionElement>
        );
    }
});