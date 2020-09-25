import React, {useContext, useEffect, useState} from "react";
import {DashboardIcon} from "../../icons/Icons";
import {Embed} from "./Embed";
import {ServerInfo} from "../../shared/ServerInfo";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {fetchEmbedList, selectEmbedListById, updateEmbed} from "../redux/embedList";
import {ApiEmbed} from "../../shared/ApiEmbed";
import "./EmbedStudio.sass";
import {convertEditableEmbed, convertToEditableEmbed, EmbedEditor, extractEmbedFiles} from "./EmbedEditor";
import {objectContains} from "../../util";
import {Button} from "../../components/Button";
import {EditorField} from "./SlateUtils";
import {Node as SlateNode} from 'slate';
import ApiClient from "../../ApiClient";
import {ChannelDropdown} from "../components/ChannelDropdown";

const ChannelContext = React.createContext<{guildId: string, channelId: string}>({guildId: "", channelId: ""});

function EmbedListEntry(props: {msg: ApiEmbed}) {
    const [editing, setEditing] = useState(false);
    if (editing) {
        return <EmbedListEntryEditor msg={props.msg} onEditFinish={() => setEditing(false)} />;
    }
    return (
        <div className="EmbedListEntry" onClick={() => setEditing(true)}>
            <span className="EmbedListEntry-messageContent">{props.msg.content}</span>
            <Embed embed={props.msg.embed}/>
        </div>
    );
}

function EmbedListEntryEditor(props: {msg?: ApiEmbed, onEditFinish: () => void}) {
    const dispatch = useDispatch();
    const channel = useContext(ChannelContext);
    const [embed, setEmbed] = useState(convertToEditableEmbed(props.msg?.embed || {}));
    const [content, setContent] = useState<SlateNode[]>([{ children: [{ text: props.msg?.content || "" }] }]);
    const save = async () => {
        const contentText = content.map(n => SlateNode.string(n)).join('\n');
        const finalEmbed = convertEditableEmbed(embed);
        try {
            let messageId;
            if (props.msg) {
                let result = await ApiClient.instance.updateEmbed(channel.guildId, channel.channelId, props.msg.id, contentText, finalEmbed);
                messageId = result.id;
            } else {
                let result = await ApiClient.instance.postEmbed(channel.guildId, channel.channelId, contentText, finalEmbed, extractEmbedFiles(embed));
                messageId = result.id;
            }
            dispatch(updateEmbed({
                guildId: channel.guildId, channelId: channel.channelId, messageId: messageId, embed: {
                    id: messageId,
                    embed: finalEmbed,
                    content: contentText
                }
            }));
            props.onEditFinish();
        } catch (e) {
            alert(e);
        }
    };
    return (
        <div className="EmbedListEntry EmbedListEntry-editMode" onChange={props.onEditFinish}>
            <EditorField className="EmbedListEntry-messageContent" value={content} onChange={setContent} placeholder="Message" />
            <EmbedEditor embed={embed} onChange={changes => setEmbed(embed => objectContains(embed, changes) ? embed : {...embed, ...changes})}/>
            <Button onClick={save}>Done</Button>
        </div>
    );
}

function EmbedList(props: {embeds: ApiEmbed[]}) {
    return (
        <div>
            {props.embeds.map(x => <EmbedListEntry msg={x} />)}
        </div>
    );
}

export function ChannelEmbedManager(props: {server: ServerInfo, channelId: string}) {
    const dispatch = useDispatch();

    const rEmbedList = useSelector((s: RootState) => selectEmbedListById(s, props.server.id, props.channelId));
    useEffect(() => {
        if (!(rEmbedList?.state))
            dispatch(fetchEmbedList({guildId: props.server.id, channelId: props.channelId}));
    }, [dispatch, rEmbedList, props.server.id, props.channelId]);

    return (
        <ChannelContext.Provider value={{guildId: props.server.id, channelId: props.channelId}}>
            {rEmbedList?.list && <EmbedList embeds={rEmbedList?.list} />}
            <EmbedListEntryEditor onEditFinish={() => {}} />
        </ChannelContext.Provider>
    );
}

export function EmbedStudio(props: {server: ServerInfo}) {
    const [channelId, setChannelId] = useState<string|null>(null);
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Embed Studio</h1>
            <ChannelDropdown value={channelId} server={props.server} onValueChanged={setChannelId} noneOption={"Select a channel"} />
            {channelId && <ChannelEmbedManager server={props.server} channelId={channelId} />}
        </div>
    );
}