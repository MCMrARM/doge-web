import React, {CSSProperties, ReactNode, useCallback, useMemo} from "react";
import {createEditor, Editor, Node as SlateNode, NodeEntry, Range} from 'slate';
import {Slate, Editable, withReact, DefaultLeaf} from 'slate-react';
import "./Embed.sass";
import "./EmbedEditor.sass";
import {CloseIcon, LinkIcon, OutlinedAddPhotoAlternativeIcon} from "../../icons/Icons";
import {Button} from "../../components/Button";
import {EmbedField, EmbedInfo, splitFields} from "./Embed";
import {RenderLeafProps} from "slate-react/dist/components/editable";
import {objectContains, useObjectURL} from "../../util";

export type EditableEmbedField = {
    name: SlateNode[],
    value: SlateNode[]
};
export type EditableEmbed = {
    author: SlateNode[],
    title: SlateNode[],
    description: SlateNode[],
    footer: SlateNode[],
    image: File|null,
    thumbnail: File|null,
    authorImage: File|null,
    footerImage: File|null,
    fields: EditableEmbedField[],
    fieldLayout: {inline: boolean}[]
};

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
            icon_url: embed.authorImage ? "attachment://embed-author.png" : undefined
        } : undefined,
        title: serialize(embed.title),
        description: serialize(embed.description),
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
    title: createDefaultNodes(),
    description: createDefaultNodes(),
    footer: createDefaultNodes(),
    image: null,
    thumbnail: null,
    authorImage: null,
    footerImage: null,
    fields: [],
    fieldLayout: []
};

function useDecorateWithPlaceholder(placeholder: string) {
    return useCallback((entry: NodeEntry): Range[] => {
        if (!Editor.isEditor(entry[0]) || Array.from(SlateNode.texts(entry[0])).length !== 1 || SlateNode.string(entry[0]) !== '')
            return [];
        const start = Editor.start(entry[0], []);
        return [{
            "$placeholder": true,
            placeholder,
            anchor: start,
            focus: start
        }];
    }, [placeholder]);
}

const renderLeaf = (props: RenderLeafProps) => {
    let children = props.children;
    if (props.leaf["$placeholder"])
        children = (
            <React.Fragment>
                <span contentEditable={false} className={"EmbedEditor-placeholder"}>{props.leaf.placeholder as ReactNode}</span>
                {props.children}
            </React.Fragment>
        );
    return <DefaultLeaf {...props} children={children} />;
};

function EditorField(props: {className: string, style?: CSSProperties, value: SlateNode[], placeholder: string, onChange: (value: SlateNode[]) => void}) {
    const editor = useMemo(() => withReact(createEditor()), []);
    const decorate = useDecorateWithPlaceholder(props.placeholder);
    return (
        <Slate editor={editor} value={props.value} onChange={props.onChange}>
            <Editable className={props.className} style={props.style} renderLeaf={renderLeaf} decorate={decorate} />
        </Slate>
    );
}

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

    return (
        <div className="Embed-wrapper">
            <div className="Embed Embed-withThumbnail EmbedEditor">
                <div className="Embed-author Embed-inlineOptions-ctr">
                    <EditorImageField className="EmbedEditor-image-small Embed-author-icon" file={props.embed.authorImage} setFile={(v) => props.onChange({authorImage: v})} noAddButton={true} />
                    <EditorField className="Embed-author-text" placeholder="Author" style={{flexGrow: 1}} value={props.embed.author} onChange={(v) => props.onChange({author: v})} />
                    <div className="Embed-inlineOptions">
                        <OutlinedAddPhotoAlternativeIcon className="Embed-inlineOption" onClick={() => selectPic((v) => props.onChange({authorImage: v}))} />
                        <LinkIcon className="Embed-inlineOption"  />
                    </div>
                </div>
                <div className="Embed-title Embed-inlineOptions-ctr">
                    <EditorField className="" style={{flexGrow: 1}} placeholder="Title" value={props.embed.title} onChange={(v) => props.onChange({title: v})} />
                    <div className="Embed-inlineOptions">
                        <LinkIcon className="Embed-inlineOption"  />
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
                        <OutlinedAddPhotoAlternativeIcon className="Embed-inlineOption" onClick={() => selectPic((v) => props.onChange({footerImage: v}))} />
                        <LinkIcon className="Embed-inlineOption" />
                    </div>
                </div>
            </div>
        </div>
    );
}