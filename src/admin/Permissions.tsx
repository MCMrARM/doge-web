import {ServerInfo} from "../shared/ServerInfo";
import {PermissionConfig, PermissionGroup} from "../shared/BotConfig";
import {CancelIcon, CheckCircleIcon, RemoveCircleIcon, SecurityIcon} from "../icons/Icons";
import React from "react";
import {RoleChipList} from "./components/RoleChipList";
import "./Permissions.sass";
import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {ChannelChipList} from "./components/ChannelChipList";
import {generateRandomHexString} from "../util";
import {SimpleDropdown} from "./components/SimpleDropdown";

function PermissionGroupSettings(props: {server: ServerInfo, forcedName?: string, config: PermissionGroup, onChange: (changes: PermissionGroup) => void, onDelete?: () => void}) {
    return <div className="Permissions-group">
        {props.forcedName && <h2>{props.forcedName}</h2>}
        {!props.forcedName && <div className="Permissions-group-header-row">
            <Input className={"Permissions-group-customTitle"} placeholder={"Name your custom permission group"} value={props.config.name || ""} onValueChange={(v) => props.onChange({...props.config, name: v})} />
            <Button theme="secondary icon" onClick={props.onDelete}><CancelIcon className="Icon" /></Button>
        </div>}
        <h4>Roles</h4>
        <div className="Permissions-group-row">
            <CheckCircleIcon className="Icon" />
            <RoleChipList value={props.config.allowedRoles} server={props.server} onValueChanged={(v) => props.onChange({...props.config, allowedRoles: v})}/>
        </div>
        <div className="Permissions-group-row">
            <RemoveCircleIcon className="Icon" />
            <RoleChipList value={props.config.disallowedRoles} server={props.server} onValueChanged={(v) => props.onChange({...props.config, disallowedRoles: v})}/>
        </div>
        <h4>Channels</h4>
        <div className="Permissions-group-row">
            <CheckCircleIcon className="Icon" />
            <ChannelChipList value={props.config.allowedChannels} server={props.server} onValueChanged={(v) => props.onChange({...props.config, allowedChannels: v})}/>
        </div>
        <div className="Permissions-group-row">
            <RemoveCircleIcon className="Icon" />
            <ChannelChipList value={props.config.disallowedChannels} server={props.server} onValueChanged={(v) => props.onChange({...props.config, disallowedChannels: v})}/>
        </div>
    </div>;
}

export function Permissions(props: {server: ServerInfo, config: PermissionConfig, onChange: (changes: Partial<PermissionConfig>) => void}) {
    let customGroupMapKv: [string, string][] = props.config.custom.filter(x => x.id).map(x => [x.id!, x.name || "(unnamed)"]);
    customGroupMapKv.unshift(["default:admin", "Administration"], ["default:mod", "Moderation"], ["default:misc", "Miscellaneous"]);
    let customGroupMap = new Map(customGroupMapKv);
    let addCustomGroup = () => {
        props.onChange({custom: [...props.config.custom, {
            id: generateRandomHexString(),
            allowedChannels: ["*"],
            disallowedChannels: [],
            allowedRoles: [props.server.id],
            disallowedRoles: []
        }]})
    };
    let updateCustomGroup = (i: number, v: PermissionGroup) => {
        let newCustom = [...props.config.custom];
        newCustom[i] = v;
        props.onChange({custom: newCustom});
    };
    let deleteCustomGroup = (i: number) => {
        props.onChange({custom: [...props.config.custom.slice(0, i), ...props.config.custom.slice(i + 1)]});
    };
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><SecurityIcon className="Icon"/> Permission Settings</h1>
            <h3>Permission Groups</h3>
            <p>In most cases, you have several permission power level roles to which you want later grant permissions. As such this bot has a permission system reflecting this. You first need to define the "power levels", which are called groups, and later assign the commands to one of them. Members with the Administrator (on Discord) permission bypass all role restrictions.</p>

            <div className="Permissions-group-list-ctr">
                <PermissionGroupSettings forcedName="Administration" config={props.config.default.admin} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, admin: v}})} />
                <PermissionGroupSettings forcedName="Moderation" config={props.config.default.mod} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, mod: v}})} />
                <PermissionGroupSettings forcedName="Miscellaneous" config={props.config.default.misc} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, misc: v}})} />
                {props.config.custom.map((x, i) =>
                    <PermissionGroupSettings key={"group-" + i} config={x} server={props.server} onChange={(v) => updateCustomGroup(i, v)} onDelete={() => deleteCustomGroup(i)} />
                )}
                <div className="Permissions-group Permissions-group-new">
                    <Button onClick={(ev) => { ev.currentTarget.blur(); addCustomGroup(); }}>Add new custom group</Button>
                </div>
            </div>

            <h3>Command Permissions</h3>
            <table className="Permissions-command-list-ctr">
                <tbody>
                    {props.server.globalCommands.map(x => (
                        <tr key={"command-" + x[0]}>
                            <th className="Permissions-command-name">{`/${x[0]}`}</th>
                            <td><SimpleDropdown value={props.config.commands[x[0]] || "default:" + x[1]} fallback={"(invalid)"} map={customGroupMap} onValueChanged={(v) => props.onChange({commands: {...props.config.commands, [x[0]]: v}})}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}