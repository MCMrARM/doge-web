import {ServerInfo} from "../shared/ServerInfo";
import {ModRoleConfig, RoleConfig} from "../shared/BotConfig";
import {AccessTimeIcon} from "../icons/Icons";
import React from "react";
import {TwoColumnOption} from "./TwoColumnOption";
import {Input} from "../components/Input";
import {RoleChipList} from "./components/RoleChipList";
import "./PersistentRoles.sass";
import {Button} from "../components/Button";

function ModroleOptions(props: {server: ServerInfo, modrole: ModRoleConfig, nameEditable?: boolean, onChange: (value: ModRoleConfig) => void, onDelete: () => void}) {
    return (
        <div className="PersistentRoles-modrole">
            <TwoColumnOption title="Identifier" description="Name of this modrole. It will be shown in moderation logs and cannot be changed later.">
                <div style={{display: "flex", flexGrow: 1}}>
                    <Input placeholder="Identifier" value={props.modrole.id} disabled={!props.nameEditable} onValueChange={props.nameEditable ? (v) => props.onChange({...props.modrole, id: v}) : undefined} />
                    <Button theme="colorless" style={{alignSelf: "stretch", marginLeft: "10px"}} onClick={props.onDelete}>Delete</Button>
                </div>
            </TwoColumnOption>
            <TwoColumnOption title="Display text" description="The text to use to refer to this role in responses. Usually the past form of the role name.">
                <div style={{flexGrow: 1}}>
                    <Input placeholder="Display text" value={props.modrole.displayText} onValueChange={(v) => props.onChange({...props.modrole, displayText: v})} />
                    <p style={{fontSize: "14px", fontStyle: "italic", padding: 0, margin: 0, marginTop: "8px"}}>A random user has been <strong>{props.modrole.displayText || "(display text)"}</strong> for a week.</p>
                </div>
            </TwoColumnOption>
            <TwoColumnOption title="Assign command name and aliases" description="Space-separated aliases of the command that assigns this modrole">
                <Input placeholder="Assign command" value={props.modrole.assignCommand.join(" ")} onValueChange={(v) => props.onChange({...props.modrole, assignCommand: v.split(" ")})} />
            </TwoColumnOption>
            <TwoColumnOption title="Remove command names and aliases" description="Space-separated aliases of the command that removes this modrole">
                <Input placeholder="Remove command" value={props.modrole.removeCommand.join(" ")} onValueChange={(v) => props.onChange({...props.modrole, removeCommand: v.split(" ")})} />
            </TwoColumnOption>
            <TwoColumnOption title="Assigned roles" description="Roles assigned to the affected members">
                <RoleChipList value={props.modrole.addRoles} server={props.server} onValueChanged={(v) => props.onChange({...props.modrole, addRoles: v})} />
            </TwoColumnOption>
            <TwoColumnOption title="Removed roles" description="Roles removed from the affected members">
                <RoleChipList value={props.modrole.removeRoles} server={props.server} onValueChanged={(v) => props.onChange({...props.modrole, removeRoles: v})} />
            </TwoColumnOption>
        </div>
    );
}

export interface PersistentRolesVolatileData {
    newIdStart?: number
}

export function PersistentRoles(props: {server: ServerInfo, config: RoleConfig, oldConfig: RoleConfig, onChange: (changes: Partial<RoleConfig>) => void, volatileData: PersistentRolesVolatileData, onVolatileDataChange: (volatileData: PersistentRolesVolatileData) => void}) {
    const newIdStart = props.volatileData.newIdStart || props.oldConfig.modroles.length;
    let deleteModrole = (i: number) => {
        props.onChange({modroles: [...props.config.modroles.slice(0, i), ...props.config.modroles.slice(i + 1)]});
        props.onVolatileDataChange({...props.volatileData, newIdStart: newIdStart - 1});
    };
    let editModrole = (i: number, value: ModRoleConfig) => {
        let newArr = [...props.config.modroles];
        newArr[i] = value;
        props.onChange({modroles: newArr});
    };
    let createNewModrole = () => {
        props.onChange({modroles: [...props.config.modroles, {id: "", displayText: "", addRoles: [], removeRoles: [], assignCommand: [], removeCommand: []}]});
    };
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><AccessTimeIcon className="Icon"/> Saved & Timed Role Settings</h1>
            <TwoColumnOption title="Sticky roles" description="Roles that are remembered and reassigned when the user rejoins the server or a modrole expires">
                <RoleChipList value={props.config.stickyRoles} server={props.server} onValueChanged={(v) => props.onChange({stickyRoles: v})} />
            </TwoColumnOption>

            <h3>Timed moderation roles</h3>
            <p>Timed moderation roles (modroles) allow you to easily create commands that assign or remove specific roles for a time duration specified using the command. This feature can be used to create timed mutes or XP bans.</p>
            <p style={{marginBottom: "32px"}}>Assigned roles that have not been set to sticky in the previous section will be automatically removed once the moderation role expires, even if the user had one of the roles assigned before. Non-sticky removed roles are also not added back. You can override this behavior by setting the specific roles as sticky. If a role is set to sticky, the bot will keep track whether the user had the rule before and reassign them after expiration appropriately.</p>

            {props.config.modroles.map((x, i) => <ModroleOptions key={"role-" + i} modrole={x} nameEditable={i >= newIdStart} server={props.server} onChange={(v) => editModrole(i, v)} onDelete={() => deleteModrole(i)}/>)}
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "40px"}}>
                <Button onClick={createNewModrole}>Add a new modrole</Button>
            </div>
        </div>
    );
}