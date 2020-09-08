import {ServerInfo} from "../shared/ServerInfo";
import {PermissionConfig, PermissionGroup} from "../shared/BotConfig";
import {CancelIcon, CheckCircleIcon, RemoveCircleIcon, SecurityIcon} from "../icons/Icons";
import React from "react";
import {RoleChipList} from "./components/RoleChipList";
import "./Permissions.sass";
import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {ChannelChipList} from "./components/ChannelChipList";

function PermissionGroupSettings(props: {server: ServerInfo, forcedName?: string, config: PermissionGroup, onChange: (changes: PermissionGroup) => void}) {
    return <div className="Permissions-group">
        {props.forcedName && <h2>{props.forcedName}</h2>}
        {!props.forcedName && <div className="Permissions-group-header-row">
            <Input className={"Permissions-group-customTitle"} placeholder={"Name your custom permission group"} value={props.config.name || ""} onValueChange={(v) => props.onChange({...props.config, name: v})} />
            <Button theme="secondary icon"><CancelIcon className="Icon" /></Button>
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
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><SecurityIcon className="Icon"/> Permission Settings</h1>
            <h3>Permission Groups</h3>
            <p>In most cases, you have several permission power level roles to which you want later grant permissions. As such this bot has a permission system reflecting this. You first need to define the "power levels", which are called groups, and later assign the commands to one of them. Members with the Administrator permission bypass all role restrictions.</p>

            <div className="Permissions-group-list-ctr">
                <PermissionGroupSettings forcedName="Administration" config={props.config.default.admin} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, admin: v}})} />
                <PermissionGroupSettings forcedName="Moderation" config={props.config.default.mod} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, mod: v}})} />
                <PermissionGroupSettings forcedName="Miscellaneous" config={props.config.default.misc} server={props.server} onChange={(v) => props.onChange({default: {...props.config.default, misc: v}})} />
                <div className="Permissions-group Permissions-group-new">
                    <Button>Add new custom group</Button>
                </div>
            </div>
        </div>
    );
}