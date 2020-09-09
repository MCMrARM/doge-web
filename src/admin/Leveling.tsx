import React, {useState} from 'react';
import {CancelIcon, CloseIcon, EmojiEventsIcon} from "../icons/Icons";
import {TwoColumnOption} from "./TwoColumnOption";
import {Slider} from "../components/Slider";
import {XpConfig} from "../shared/BotConfig";
import {ChannelChipList} from "./components/ChannelChipList";
import {ServerInfo} from "../shared/ServerInfo";
import {RoleChipList} from "./components/RoleChipList";
import {SimpleDropdown} from "./components/SimpleDropdown";
import {ChannelDropdown} from "./components/ChannelDropdown";
import {TextAreaList} from "./components/TextAreaList";
import {Input} from "../components/Input";
import {RoleDropdown} from "./components/RoleDropdown";
import {Button} from "../components/Button";
import {NumberInput} from "./components/NumberInput";

const multiplierValues = [0.25, 0.5, 1, 1.5, 2, 2.5, 3];
const levelUpAnnouncementModes = new Map<"channel"|"direct"|null, string>();
levelUpAnnouncementModes.set(null, "Disabled");
levelUpAnnouncementModes.set("direct", "Private message");
levelUpAnnouncementModes.set("channel", "Channel message");

function AutoRoleOptions(props: {config: [number, string, string|null][], server: ServerInfo, onChange: (changes: [number, string, string|null][]) => void}) {
    let [lastEntry, setLastEntry] = useState<[number|undefined, string|null, string|null]>([undefined, null, null]);
    let updateEntry = (index: number, value: [number|undefined, string|null, string|null]) => {
        if (index !== props.config.length) {
            let arr = [...props.config];
            arr[index] = value as [number, string, string|null];
            props.onChange(arr);
        } else {
            if (value[0] !== undefined && value[1] !== null) {
                props.onChange([...props.config, value as [number, string, string|null]]);
                setLastEntry([undefined, null, null]);
            } else {
                setLastEntry(value);
            }
        }
    };
    let deleteEntry = (index: number) => {
        props.onChange([...props.config.slice(0, index), ...props.config.slice(index + 1)]);
    };
    let createRow = (index: number, level: number|undefined, roleId: string|null, name: string|null) => (
        <tr key={index}>
            <td style={{width: "20%"}}><NumberInput value={level} type="number" placeholder="Level" onValueChange={(v) => updateEntry(index, [v, roleId, name])} /></td>
            <td style={{width: "40%"}}><RoleDropdown value={roleId} server={props.server} onValueChanged={(v) => updateEntry(index, [level, v, name])} placeholder={<span className="placeholder">Role</span>} /></td>
            <td style={{width: "40%"}}><Input placeholder="Custom name" value={name || undefined} onValueChange={(v) => updateEntry(index, [level, roleId, v])} /></td>
            <td style={{width: "40px"}}>{index !== props.config.length && <Button theme="secondary icon" onClick={() => deleteEntry(index)}><CancelIcon className="Icon" /></Button>}</td>
        </tr>
    );
    return <table style={{flexGrow: 1}}>
        <tbody>
            {props.config.map((x, i) => createRow(i, x[0], x[1], x[2]))}
            {createRow(props.config.length, lastEntry[0], lastEntry[1], lastEntry[2])}
        </tbody>
    </table>;
}

export function Leveling(props: {server: ServerInfo, config: XpConfig, onChange: (changes: Partial<XpConfig>) => void}) {
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><EmojiEventsIcon className="Icon"/> Leveling Settings</h1>
            <TwoColumnOption title="XP multiplier" description="Server-wide multiplier applied to gained experience">
                <Slider value={multiplierValues.indexOf(props.config.multiplier)} min={0} max={multiplierValues.length - 1} labels={multiplierValues.map((x, i) => [i, `x${x}`])} onValueChanged={(v) => props.onChange({multiplier: multiplierValues[Math.round(v)]})} />
            </TwoColumnOption>
            <TwoColumnOption title="Disabled channels" description="Experience cannot be gained in these channels">
                <ChannelChipList value={props.config.disabledChannels} server={props.server} onValueChanged={(v) => props.onChange({disabledChannels: v})} />
            </TwoColumnOption>
            <TwoColumnOption title="Disabled roles" description="Experience cannot be gained by members that have these roles">
                <RoleChipList value={props.config.disabledRoles} server={props.server} onValueChanged={(v) => props.onChange({disabledRoles: v})} />
            </TwoColumnOption>
            <TwoColumnOption title="Level up message" description="A level up message will be sent either directly to the user or to a channel">
                <div style={{flexGrow: 1}}>
                    <SimpleDropdown value={props.config.levelUpAnnouncementMode} map={levelUpAnnouncementModes} onValueChanged={(v) => props.onChange({levelUpAnnouncementMode: v})} style={{marginBottom: "4px"}} />
                    {props.config.levelUpAnnouncementMode === "channel" &&
                        <ChannelDropdown value={props.config.levelUpChannel} server={props.server} onValueChanged={(v) => props.onChange({levelUpChannel: v})} style={{marginBottom: "16px"}} />}
                    <TextAreaList value={props.config.levelUpMessages} placeholder="Write another level up message..." onValueChanged={(v) => props.onChange({levelUpMessages: v})} />
                </div>
            </TwoColumnOption>
            <TwoColumnOption title="Roles" description="Roles will be automatically assigned to members once they reach the given level">
                <AutoRoleOptions config={props.config.roles} server={props.server} onChange={(v) => props.onChange({roles: v})} />
            </TwoColumnOption>
        </div>
    );
}