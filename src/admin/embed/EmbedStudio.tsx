import React, {useEffect, useState} from "react";
import {DashboardIcon} from "../../icons/Icons";
import {Embed} from "./Embed";
import {ServerInfo} from "../../shared/ServerInfo";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {fetchEmbedList, selectEmbedListById} from "../redux/embedList";
import {ApiEmbed} from "../../shared/ApiEmbed";
import "./EmbedStudio.sass";
import {convertToEditableEmbed, EmbedEditor} from "./EmbedEditor";
import {objectContains} from "../../util";
import {Button} from "../../components/Button";
import {EditorField} from "./SlateUtils";
import {Node as SlateNode} from 'slate';

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
function EmbedListEntryEditor(props: {msg: ApiEmbed, onEditFinish: () => void}) {
    const [embed, setEmbed] = useState(convertToEditableEmbed(props.msg.embed));
    const [content, setContent] = useState<SlateNode[]>([{ children: [{ text: props.msg.content }] }]);
    return (
        <div className="EmbedListEntry EmbedListEntry-editMode" onChange={props.onEditFinish}>
            <EditorField className="EmbedListEntry-messageContent" value={content} onChange={setContent} placeholder="Message" />
            <EmbedEditor embed={embed} onChange={changes => setEmbed(embed => objectContains(embed, changes) ? embed : {...embed, ...changes})}/>
            <Button onClick={props.onEditFinish}>Done</Button>
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

export function EmbedStudio(props: {server: ServerInfo}) {
    const dispatch = useDispatch();

    const rEmbedList = useSelector((s: RootState) => selectEmbedListById(s, props.server.id, "450728088977014785"));
    useEffect(() => {
        if (!(rEmbedList?.state))
            dispatch(fetchEmbedList({guildId: props.server.id, channelId: "450728088977014785"}));
    }, [dispatch, rEmbedList, props.server.id]);


    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Embed Studio</h1>
            {rEmbedList?.list && <EmbedList embeds={rEmbedList?.list} />}
        </div>
    );
}