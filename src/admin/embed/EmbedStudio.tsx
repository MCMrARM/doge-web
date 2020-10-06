import React, {FocusEvent, useContext, useEffect, useRef, useState} from "react";
import {CloseIcon, CodeIcon, DashboardIcon, PaletteIcon} from "../../icons/Icons";
import {Embed, EmbedInfo} from "./Embed";
import {ServerInfo} from "../../shared/ServerInfo";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {fetchEmbedList, selectEmbedListById, updateEmbed, deleteEmbed} from "../redux/embedList";
import {ApiEmbed} from "../../shared/ApiEmbed";
import "./EmbedStudio.sass";
import {
    convertEditableEmbed,
    convertToEditableEmbed,
    EmbedEditor,
    extractEmbedFiles,
    selectPic
} from "./EmbedEditor";
import {objectContains} from "../../util";
import {Button} from "../../components/Button";
import {EditorField} from "./SlateUtils";
import {Node as SlateNode} from 'slate';
import ApiClient from "../../ApiClient";
import {ChannelDropdown} from "../components/ChannelDropdown";
import {HsvColorPicker} from "../../components/ColorPicker";
import {Input} from "../../components/Input";
import rgbToHsv from "rgb-hsv";
import hsvToRgb from "hsv-rgb";
import {colorArrToNumber, colorIntToHexString, colorIntToArr, parseColor} from "../../colorUtil";
import {TextArea} from "../../components/TextArea";
import {useRouteMatch, useHistory} from "react-router-dom";

const ChannelContext = React.createContext<{guildId: string, channelId: string}>({guildId: "", channelId: ""});

function EmbedListEntry(props: {msg: ApiEmbed}) {
    const [editing, setEditing] = useState(false);
    if (editing) {
        return <EmbedListEntryEditor msg={props.msg} onEditFinish={() => setEditing(false)} />;
    }
    return (
        <div className="EmbedListEntry" onClick={() => setEditing(true)}>
            <span className="EmbedListEntry-messageContent">{props.msg.content}</span>
            {props.msg.embed && <Embed embed={props.msg.embed}/>}
        </div>
    );
}

export function EmbedColorIconDropdown(props: {value: number, onChange: (value: number) => void}) {
    let [hsv, setHsv] = useState<[number, number, number]>([0, 0, 0]);
    const hsvRgb = hsvToRgb(...hsv);
    if (colorArrToNumber(hsvRgb) !== props.value)
        hsv = rgbToHsv(...colorIntToArr(props.value));

    const [visible, setVisible] = useState(false);
    const [text, setTextField] = useState<string|null>(null);
    const setText = (text: string) => {
        const c = parseColor(text);
        if (c !== null && c[3] === 255)
            props.onChange(colorArrToNumber([c[0], c[1], c[2]]));
        setTextField(text);
    };
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (visible)
            dropdownRef.current?.focus();
    }, [visible]);
    let onBlur = (ev: FocusEvent) => { if (!ev.currentTarget.contains(ev.relatedTarget as Node)) setVisible(false) };
    return (
        <div className="ColorIconDropdown EmbedListEntry-embedOption">
            <Button theme="colorless icon" onClick={() => setVisible(true)} ><PaletteIcon className="Icon" /></Button>
            {visible && <div ref={dropdownRef} className="ColorIconDropdown-dropdown" tabIndex={0} onBlur={onBlur}>
                <HsvColorPicker hsv={hsv} onHsvChange={(hsv) => { props.onChange(colorArrToNumber(hsvToRgb(...hsv))); setHsv(hsv); }} />
                <Input type={"text"} value={text !== null ? text : colorIntToHexString(props.value)} onValueChange={setText} onBlur={() => setTextField(null)} style={{marginTop: "16px", fontSize: "12px", padding: "4px 8px"}} />
            </div>}
        </div>
    );
}

function EmbedListEntryEditor(props: {className?: string, msg?: ApiEmbed, onEditFinish: () => void}) {
    const dispatch = useDispatch();
    const channel = useContext(ChannelContext);
    const [hasEmbed, setHasEmbed] = useState(Object.keys(props.msg?.embed || {}).length > 0);
    const [embedCodeView, setEmbedCodeView] = useState(false);
    let [currentEmbedCode, setCurrentEmbedCode] = useState<[string|null, string|null, string?]>([null, null]);
    const [embed, setEmbed] = useState(convertToEditableEmbed(props.msg?.embed || {}));
    const [content, setContent] = useState<SlateNode[]>([{ children: [{ text: props.msg?.content || "" }] }]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const save = async () => {
        const contentText = content.map(n => SlateNode.string(n)).join('\n');
        const finalEmbed = hasEmbed ? convertEditableEmbed(embed) : {};
        try {
            let message;
            if (props.msg) {
                message = await ApiClient.instance.updateEmbed(channel.guildId, channel.channelId, props.msg.id, contentText, finalEmbed);
            } else {
                message = await ApiClient.instance.postEmbed(channel.guildId, channel.channelId, contentText, finalEmbed, extractEmbedFiles(embed).concat(attachments.map(x => [x.name, x])));
            }
            dispatch(updateEmbed({
                guildId: channel.guildId, channelId: channel.channelId, messageId: message.id, embed: message
            }));
            props.onEditFinish();
        } catch (e) {
            alert(e);
        }
    };
    const doDelete = async () => {
        if (!props.msg)
            return;
        try {
            await ApiClient.instance.deleteEmbed(channel.guildId, channel.channelId, props.msg.id);
            dispatch(deleteEmbed({
                guildId: channel.guildId, channelId: channel.channelId, messageId: props.msg.id
            }));
            props.onEditFinish();
        } catch (e) {
            alert(e);
        }
    };
    const requestAddFile = () => selectPic(file => setAttachments([...attachments, file]));
    const removeEmbed = (idx: number) =>  setAttachments([...attachments.slice(0, idx), ...attachments.slice(idx + 1)]);

    let embedBaseJson = "";
    if (embedCodeView) {
        embedBaseJson = JSON.stringify(convertEditableEmbed(embed));
        if (currentEmbedCode[0] !== embedBaseJson)
            currentEmbedCode = [embedBaseJson, embedBaseJson];
    }
    const trySetEmbedCode = (value: string) => {
        let embed;
        try {
            embed = convertToEditableEmbed(JSON.parse(value) as EmbedInfo);
        } catch (e) {
            setCurrentEmbedCode([embedBaseJson, value, e.toLocaleString()]);
            return;
        }
        setEmbed(embed);
        setCurrentEmbedCode([embedBaseJson, value]);
    };

    return (
        <div className={"EmbedListEntry EmbedListEntry-editMode" + (props.className ? ` ${props.className}` : "")}>
            <EditorField className="EmbedListEntry-messageContent" value={content} onChange={setContent} placeholder="Message" />
            {hasEmbed && (
                <div className="EmbedListEntry-embed">
                    <EmbedEditor embed={embed} onChange={changes => setEmbed(embed => objectContains(embed, changes) ? embed : {...embed, ...changes})} />
                    <div className="EmbedListEntry-embedOptions">
                        <Button theme="colorless icon" className="EmbedListEntry-embedOption" onClick={() => setHasEmbed(false)} ><CloseIcon className="Icon" /></Button>
                        <EmbedColorIconDropdown value={embed.color !== undefined ? embed.color : 0x202225} onChange={(v) => setEmbed({...embed, color: v})} />
                        <Button theme="colorless icon" className="EmbedListEntry-embedOption" onClick={() => setEmbedCodeView(!embedCodeView)} ><CodeIcon className="Icon" /></Button>
                    </div>
                    {embedCodeView && (
                        <div className="EmbedListEntry-codeEdit">
                            <TextArea value={currentEmbedCode[1] || ""} onValueChange={trySetEmbedCode} />
                            <div className="EmbedListEntry-codeEditError">{currentEmbedCode[2]}</div>
                        </div>
                    )}
                </div>
            )}
            <div className="EmbedListEntry-attachments">
                {attachments.map((x, i) => (
                    <div className="EmbedListEntry-attachment" key={"attachment-" + i}>{x.name} <Button theme="secondary icon" className="EmbedListEntry-attachment-delete" onClick={() => setHasEmbed(false)} ><CloseIcon className="Icon" onClick={() => removeEmbed(i)} /></Button></div>
                ))}
            </div>
            <div className="EmbedListEntry-buttons">
                <Button onClick={save}>{props.msg ? "Done" : "Send"}</Button>
                {props.msg && <Button theme="secondary" style={{marginLeft: "4px"}} onClick={props.onEditFinish}>Cancel</Button>}
                {props.msg && <Button theme="secondary" style={{marginLeft: "4px"}} onClick={doDelete}>Delete</Button>}
                {!hasEmbed && <Button theme="secondary" style={{marginLeft: "4px"}} onClick={() => setHasEmbed(true)}>Add embed</Button>}
                {!props.msg && <Button theme="secondary" style={{marginLeft: "4px"}} onClick={requestAddFile}>Attach file</Button>}
            </div>
        </div>
    );
}

function EmbedList(props: {embeds: ApiEmbed[]}) {
    return (
        <div>
            {props.embeds.map(x => <EmbedListEntry key={x.id} msg={x} />)}
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
            <EmbedListEntryEditor className="new" onEditFinish={() => {}} />
        </ChannelContext.Provider>
    );
}

export function EmbedStudio(props: {server: ServerInfo}) {
    const history = useHistory();
    const routeMatch = useRouteMatch<{channel: string}>("/:id/admin/embed/:channel");
    const channelId = routeMatch?.params.channel || null;

    return (
        <div className="AdminPage EmbedStudio">
            <h1 className="AdminPage-Title"><DashboardIcon className="Icon"/> Embed Studio</h1>
            <ChannelDropdown value={channelId} server={props.server} onValueChanged={(chan) => history.replace(`/${props.server.id}/admin/embed/${chan}`)} style={{marginBottom: "16px"}} noneOption={"Select a channel"} />
            {channelId && <ChannelEmbedManager server={props.server} channelId={channelId} />}
        </div>
    );
}