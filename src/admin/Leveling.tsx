import React, {useState} from 'react';
import {EmojiEventsIcon} from "../icons/Icons";
import {TwoColumnOption} from "./TwoColumnOption";
import {Slider} from "../components/Slider";
import {Chip, ChipList} from "../components/ChipList";
import {Dropdown} from "../components/Dropdown";
import {TextArea} from "../components/TextArea";

export function Leveling() {
    let multiplierValues = [0.25, 0.5, 1, 1.5, 2, 2.5, 3];
    let [multiplierValue, setMultiplierValue] = useState(0);

    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><EmojiEventsIcon className="Icon"/> Leveling Settings</h1>
            <TwoColumnOption title="XP multiplier" description="Server-wide multiplier applied to gained experience">
                <Slider value={multiplierValue} min={0} max={multiplierValues.length - 1} labels={multiplierValues.map((x, i) => [i, `x${x}`])} onValueChanged={(v) => setMultiplierValue(Math.round(v))} />
            </TwoColumnOption>
            <TwoColumnOption title="Blacklisted channels" description="Experience cannot be gained in these channels">
                <ChipList>
                    <Chip onRemove={() => {}}>#test</Chip>
                </ChipList>
            </TwoColumnOption>
            <TwoColumnOption title="Blacklisted roles" description="Experience cannot be gained by members that have these roles">
                <ChipList />
            </TwoColumnOption>
            <TwoColumnOption title="Level up message" description="A level up message can be sent either directly to the user or to a channel">
                <div style={{width: "100%"}}>
                    <Dropdown selectedItem={"Private message"}>
                        <Dropdown.Item>Disabled</Dropdown.Item>
                        <Dropdown.Item selected={true}>Private message</Dropdown.Item>
                        <Dropdown.Item>Channel message</Dropdown.Item>
                    </Dropdown>
                    <TextArea>{"Hey {user}, you reached level {level}!"}</TextArea>
                    <TextArea placeholder={"Add another message"} />
                </div>
            </TwoColumnOption>
        </div>
    );
}