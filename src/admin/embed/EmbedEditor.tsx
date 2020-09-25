import React, {FocusEvent, useRef, useState, KeyboardEvent} from "react";
import {Node as SlateNode} from 'slate';
import "./Embed.sass";
import "./EmbedEditor.sass";
import {CloseIcon, LinkIcon, OutlinedAddPhotoAlternativeIcon} from "../../icons/Icons";
import {Button} from "../../components/Button";
import {EmbedField, EmbedInfo, splitFields} from "./Embed";
import {objectContains, useObjectURL} from "../../util";
import {EditorField} from "./SlateUtils";

export type EditableEmbedField = {
    name: SlateNode[],
    value: SlateNode[]
};
export type EditableEmbed = {
    author: SlateNode[],
    authorUrl: string,
    title: SlateNode[],
    description: SlateNode[],
    url: string,
    footer: SlateNode[],
    image: File|null,
    thumbnail: File|null,
    authorImage: File|null,
    footerImage: File|null,
    fields: EditableEmbedField[],
    fieldLayout: {inline: boolean}[]
};

export function convertToEditableEmbed(embed: EmbedInfo): EditableEmbed {
    const deserialize = (text: string|undefined): SlateNode[] => [{ children: [{ text: text || "" }] }];
    return {
        author: deserialize(embed.author?.name),
        authorUrl: embed.author?.url || "",
        title: deserialize(embed.title),
        description: deserialize(embed.description),
        url: embed.url || "",
        footer: deserialize(embed.footer?.text),
        image: null,
        thumbnail: null,
        authorImage: null,
        footerImage: null,
        fields: [],
        fieldLayout: []
    };
}

export function convertEditableEmbed(embed: EditableEmbed): EmbedInfo {
    const serialize = (nodes: SlateNode[]) => nodes.map(n => SlateNode.string(n)).join('\n') || undefined;
    const fields: EmbedField[] = embed.fields.map((field, i) => ({
        name: serialize(field.name)!,
        value: serialize(field.value)!,
        inline: embed.fieldLayout[i].inline
    }));
    return {
        author: serialize(embed.author) ? {
            name: serialize(embed.author),
            url: embed.authorUrl || undefined,
            icon_url: embed.authorImage ? "attachment://embed-author.png" : undefined
        } : undefined,
        title: serialize(embed.title),
        description: serialize(embed.description),
        url: embed.url || undefined,
        fields: fields,
        footer: serialize(embed.footer) ? {
            text: serialize(embed.footer),
            icon_url: embed.footerImage ? "attachment://embed-footer.png" : undefined
        } : undefined,
        image: embed.image ? {
            url: "attachment://embed-image.png"
        } : undefined,
        thumbnail: embed.thumbnail ? {
            url: "attachment://embed-thumbnail.png"
        } : undefined
    };
}

export function extractEmbedFiles(embed: EditableEmbed): [string, File][] {
    const ret: [string, File][] = [];
    if (embed.image)
        ret.push(["embed-image.png", embed.image]);
    if (embed.thumbnail)
        ret.push(["embed-thumbnail.png", embed.thumbnail]);
    if (embed.authorImage)
        ret.push(["embed-author.png", embed.authorImage]);
    if (embed.footerImage)
        ret.push(["embed-footer.png", embed.footerImage]);
    return ret;
}

const createDefaultNodes = (): SlateNode[] => [{ children: [{ text: '' }] }];
export const defaultEmbed: EditableEmbed = {
    author: createDefaultNodes(),
    authorUrl: "",
    title: createDefaultNodes(),
    description: createDefaultNodes(),
    url: "",
    footer: createDefaultNodes(),
    image: null,
    thumbnail: null,
    authorImage: null,
    footerImage: null,
    fields: [],
    fieldLayout: []
};

function selectPic(callback: (file: File) => void) {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
        if (!input.files || input.files.length === 0)
            return;
        callback(input.files[0]);
    };
    input.click();
}

function EditorImageField(props: {file: File|null, setFile: (file: File|null) => void, className?: string, noAddButton?: boolean}) {
    const objectURL = useObjectURL(props.file);
    if (objectURL) {
        return (
            <div className={"EmbedEditor-image" + (props.className ? ` ${props.className}` : "")} onClick={() => props.setFile(null)}>
                <img src={objectURL} alt="" />
                <div className="EmbedEditor-imageDarken" />
                <CloseIcon className="EmbedEditor-removeImage" />
            </div>
        );
    }
    if (props.noAddButton)
        return null;
    return (
        <Button theme="secondary icon" className="EmbedEditor-addImage" onClick={() => selectPic(props.setFile)}>
            <OutlinedAddPhotoAlternativeIcon />
        </Button>
    );
}

function UrlDropDown(props: {url: string, setUrl: (value: string) => void, onCloseRequested: () => void}) {
    const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === "Escape")
            props.onCloseRequested();
    };
    return (
        <div className="EmbedEditor-UrlDropDown">
            <input autoFocus={true} type="text" placeholder="Enter URL here" value={props.url} onChange={(e) => props.setUrl(e.target.value)} onKeyDown={onKeyDown} />
        </div>
    )
}

export function EmbedEditor(props: {embed: EditableEmbed, onChange: (embed: Partial<EditableEmbed>) => void}) {
    const fieldRows = splitFields(props.embed.fieldLayout || []);

    const addField = (inline: boolean) => {
        props.onChange({
            fields: [...props.embed.fields, {name: createDefaultNodes(), value: createDefaultNodes()}],
            fieldLayout: [...props.embed.fieldLayout, {inline: inline}]
        });
    };
    const removeField = (index: number) => {
        props.onChange({
            fields: [...props.embed.fields.slice(0, index), ...props.embed.fields.slice(index + 1)],
            fieldLayout: [...props.embed.fieldLayout.slice(0, index), ...props.embed.fieldLayout.slice(index + 1)]
        });
    };
    const updateField = (index: number, changes: Partial<EditableEmbedField>) => {
        if (!objectContains(props.embed.fields[index], changes)) {
            let copy = [...props.embed.fields];
            copy[index] = {...copy[index], ...changes};
            props.onChange({fields: copy});
        }
    };
    let ki = 0;
    const fields = fieldRows.flatMap((list, i) => (
        list.map((x, j) => {
            const units = 12 / list.length;
            const k = ki++;
            return <div className="Embed-field" key={"field-" + i + "-" + j} style={{gridColumn: `${1 + units * j}/${1 + units * (j + 1)}`}}>
                <CloseIcon className="EmbedEditor-field-remove" onClick={() => removeField(k)} />
                <EditorField className="Embed-field-name" placeholder="Name" value={props.embed.fields[k].name} onChange={(v) => updateField(k, {name: v})}/>
                <EditorField className="Embed-field-value" placeholder="Value" value={props.embed.fields[k].value} onChange={(v) => updateField(k, {value: v})}/>
            </div>;
        })
    ));

    const authorInlineOptions = useRef<HTMLDivElement>(null);
    const [authorUrlBoxOpen, setAuthorUrlBoxOpen] = useState(false);
    const [urlBoxOpen, setUrlBoxOpen] = useState(false);
    const onInlineOptionsBlur = (ev: FocusEvent<HTMLElement>, setBoxOpenCb: (v: boolean) => void) => {
        if (!ev.currentTarget.contains(ev.relatedTarget as Node))
            setBoxOpenCb(false);
    };

    return (
        <div className="Embed-wrapper">
            <div className="Embed Embed-withThumbnail EmbedEditor">
                <div className="Embed-author Embed-inlineOptions-ctr">
                    <EditorImageField className="EmbedEditor-image-small Embed-author-icon" file={props.embed.authorImage} setFile={(v) => props.onChange({authorImage: v})} noAddButton={true} />
                    <EditorField className="Embed-author-text" placeholder="Author" style={{flexGrow: 1}} value={props.embed.author} onChange={(v) => props.onChange({author: v})} />
                    <div ref={authorInlineOptions} className="Embed-inlineOptions" onBlur={(ev) => onInlineOptionsBlur(ev, setAuthorUrlBoxOpen)}>
                        <OutlinedAddPhotoAlternativeIcon className="Embed-inlineOption" onClick={() => selectPic((v) => props.onChange({authorImage: v}))} tabIndex={0} />
                        <LinkIcon className={"Embed-inlineOption" + (authorUrlBoxOpen ? " active" : "")} onClick={() => setAuthorUrlBoxOpen(!authorUrlBoxOpen)} tabIndex={0} />
                        {authorUrlBoxOpen && <UrlDropDown url={props.embed.authorUrl} setUrl={(v) => props.onChange({authorUrl: v})} onCloseRequested={() => setAuthorUrlBoxOpen(false)} />}
                    </div>
                </div>
                <div className="Embed-title Embed-inlineOptions-ctr">
                    <EditorField className="" style={{flexGrow: 1}} placeholder="Title" value={props.embed.title} onChange={(v) => props.onChange({title: v})} />
                    <div className="Embed-inlineOptions" onBlur={(ev) => onInlineOptionsBlur(ev, setUrlBoxOpen)}>
                        <LinkIcon className={"Embed-inlineOption" + (urlBoxOpen ? " active" : "")} onClick={() => setUrlBoxOpen(!urlBoxOpen)} tabIndex={0} />
                        {urlBoxOpen && <UrlDropDown url={props.embed.url} setUrl={(v) => props.onChange({url: v})} onCloseRequested={() => setUrlBoxOpen(false)} />}
                    </div>
                </div>
                <EditorField className="Embed-description" placeholder="Description" value={props.embed.description} onChange={(v) => props.onChange({description: v})} />
                <div className="Embed-fields">
                    {fields}
                </div>
                <div className="EmbedEditor-field-actions">
                    <button onClick={() => addField(false)}>Add field</button> <button onClick={() => addField(true)}>Add inline field</button>
                </div>
                <div className="Embed-media EmbedEditor-imageContainer">
                    <EditorImageField file={props.embed.image} setFile={(v) => props.onChange({image: v})} />
                </div>
                <div className="Embed-thumbnail EmbedEditor-imageContainer">
                    <EditorImageField file={props.embed.thumbnail} setFile={(v) => props.onChange({thumbnail: v})} />
                </div>
                <div className="Embed-footer Embed-inlineOptions-ctr">
                    <EditorImageField className="EmbedEditor-image-small Embed-footer-icon" file={props.embed.footerImage} setFile={(v) => props.onChange({footerImage: v})} noAddButton={true} />
                    <EditorField className="Embed-footer-text" placeholder="Footer" style={{flexGrow: 1}} value={props.embed.footer} onChange={(v) => props.onChange({footer: v})} />
                    <div className="Embed-inlineOptions">
                        <OutlinedAddPhotoAlternativeIcon className="Embed-inlineOption" onClick={() => selectPic((v) => props.onChange({footerImage: v}))} tabIndex={0} />
                    </div>
                </div>
            </div>
        </div>
    );
}