import React from 'react';
import {EmojiEventsIcon} from "../icons/Icons";
import {TwoColumnOption} from "./TwoColumnOption";
import {Slider} from "../components/Slider";
import {Dropdown} from "../components/Dropdown";
import {TextArea} from "../components/TextArea";
import {XpConfig} from "../shared/BotConfig";
import {ChannelChipList} from "./components/ChannelChipList";
import {ServerInfo} from "../shared/ServerInfo";
import {RoleChipList} from "./components/RoleChipList";
import {SimpleDropdown} from "./components/SimpleDropdown";

const multiplierValues = [0.25, 0.5, 1, 1.5, 2, 2.5, 3];
const levelUpAnnouncementModes = new Map<"channel"|"direct"|null, string>();
levelUpAnnouncementModes.set(null, "Disabled");
levelUpAnnouncementModes.set("direct", "Private message");
levelUpAnnouncementModes.set("channel", "Channel message");

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
            <TwoColumnOption title="Level up message" description="A level up message can be sent either directly to the user or to a channel">
                <div style={{width: "100%"}}>
                    <SimpleDropdown value={props.config.levelUpAnnouncementMode} map={levelUpAnnouncementModes} onValueChanged={(v) => props.onChange({levelUpAnnouncementMode: v})}/>
                    <TextArea>{"Hey {user}, you reached level {level}!"}</TextArea>
                    <TextArea placeholder={"Add another message"} />
                </div>
            </TwoColumnOption>
        </div>
    );
}