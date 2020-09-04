import {ServerInfo} from "../shared/ServerInfo";
import {LogConfig} from "../shared/BotConfig";
import {HistoryEduIcon} from "../icons/Icons";
import React from "react";
import {TwoColumnOption} from "./TwoColumnOption";
import {ChannelDropdown} from "./components/ChannelDropdown";
import {CheckBoxList} from "./components/CheckBoxList";

const auditLogEvents1 = {
    "MESSAGE_DELETE": "Message Delete",
    "MESSAGE_UPDATE": "Message Update",
    "MEMBER_UPDATE": "Member Update",
    "MEMBER_ROLE_UPDATE": "Member Role Update",
    "MEMBER_BAN_ADD": "Member Ban",
    "MEMBER_BAN_REMOVE": "Member Unban",
    "MEMBER_LEAVE": "Member Kick/Leave"
};
const auditLogEvents2 = {
    "CHANNEL_CREATE": "Channel Create",
    "CHANNEL_DELETE": "Channel Delete",
    "CHANNEL_UPDATE": "Channel Update",
    "CHANNEL_OVERWRITE_UPDATE": "Channel Permissions Update"
};

export function Logging(props: {server: ServerInfo, config: LogConfig, onChange: (changes: Partial<LogConfig>) => void}) {
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><HistoryEduIcon className="Icon"/> Logging Settings</h1>
            <TwoColumnOption title="Audit Log Channel" description="Audit messages will be sent to the selected channel">
                <ChannelDropdown value={props.config.textAuditLogChannel} server={props.server} noneOption="Disabled" onValueChanged={(v) => props.onChange({textAuditLogChannel: v})} />
            </TwoColumnOption>
            <TwoColumnOption title="Audit Log Events" description="Only messages for the selected types will be sent">
                <CheckBoxList style={{flexGrow: 1}} value={props.config.textAuditLogEventTypes} map={auditLogEvents1} onChange={(v) => props.onChange({textAuditLogEventTypes: v})} />
                <CheckBoxList style={{flexGrow: 1}} value={props.config.textAuditLogEventTypes} map={auditLogEvents2} onChange={(v) => props.onChange({textAuditLogEventTypes: v})} />
            </TwoColumnOption>
            <TwoColumnOption title="Error Message Channel" description="At times a background error might occur, for example when auto-unbanning. A message will be sent to the specified channel if that happen.">
                <ChannelDropdown value={props.config.errorMessageChannel} server={props.server} noneOption="Disabled" onValueChanged={(v) => props.onChange({errorMessageChannel: v})} />
            </TwoColumnOption>
        </div>
    );
}