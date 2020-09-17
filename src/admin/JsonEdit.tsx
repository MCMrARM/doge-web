import {ServerInfo} from "../shared/ServerInfo";
import {BotConfig, LogConfig} from "../shared/BotConfig";
import {CodeIcon} from "../icons/Icons";
import React, {useState} from "react";
import {TextArea} from "../components/TextArea";

export function JsonEdit(props: {server: ServerInfo, config: BotConfig, onChange: (changes: BotConfig) => void}) {
    const [text, setText] = useState(JSON.stringify(props.config));
    const [error, setError] = useState<string|null>(null);
    let setJsonText = (text: string) => {
        setText(text);
        setError("");
        try {
            props.onChange(JSON.parse(text));
        } catch (e) {
            setError(e.message);
        }
    };
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><CodeIcon className="Icon"/> JSON Editor</h1>
            <p>Most configuration data for this bot is saved as JSON data. In some cases you might want to edit this data directly. Note that pasting invalid configuration here might break the webapp and you might need to reload the page.</p>

            <TextArea value={text} onChange={(t) => setJsonText(t)} />
            {error && <div style={{background: "#bf3939", padding: "8px", borderRadius: "8px", marginTop: "16px"}}>{error}</div>}
        </div>
    );
}