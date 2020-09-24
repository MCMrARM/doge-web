import React, {CSSProperties, ReactNode, useCallback, useMemo} from "react";
import {createEditor, Editor, Node as SlateNode, NodeEntry, Range} from 'slate';
import {Slate, Editable, withReact, DefaultLeaf} from 'slate-react';
import "./Embed.sass";
import "./EmbedEditor.sass";
import {OutlinedAddPhotoAlternativeIcon} from "../../icons/Icons";
import {Button} from "../../components/Button";
import {EmbedField, EmbedInfo, splitFields} from "./Embed";
import {RenderLeafProps} from "slate-react/dist/components/editable";
import {objectContains} from "../../util";

export type EditableEmbedField = {
    name: SlateNode[],
    value: SlateNode[]
};
export type EditableEmbed = {
    author: SlateNode[],
    title: SlateNode[],
    description: SlateNode[],
    footer: SlateNode[],
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
            name: serialize(embed.author)
        } : undefined,
        title: serialize(embed.title),
        description: serialize(embed.description),
        fields: fields,
        footer: serialize(embed.footer) ? {
            text: serialize(embed.footer)
        } : undefined
    };
}

const createDefaultNodes = (): SlateNode[] => [{ children: [{ text: '' }] }];
export const defaultEmbed: EditableEmbed = {
    author: createDefaultNodes(),
    title: createDefaultNodes(),
    description: createDefaultNodes(),
    footer: createDefaultNodes(),
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

export function EmbedEditor(props: {embed: EditableEmbed, onChange: (embed: Partial<EditableEmbed>) => void}) {
    const fieldRows = splitFields(props.embed.fieldLayout || []);

    const addField = (inline: boolean) => {
        props.onChange({
            fields: [...props.embed.fields, {name: createDefaultNodes(), value: createDefaultNodes()}],
            fieldLayout: [...props.embed.fieldLayout, {inline: inline}]
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
                <EditorField className="Embed-field-name" placeholder="Name" value={props.embed.fields[k].name} onChange={(v) => updateField(k, {name: v})}/>
                <EditorField className="Embed-field-value" placeholder="Value" value={props.embed.fields[k].value} onChange={(v) => updateField(k, {value: v})}/>
            </div>;
        })
    ));

    return (
        <div className="Embed-wrapper">
            <div className="Embed Embed-withThumbnail EmbedEditor">
                <div className="Embed-author">
                    <EditorField className="Embed-author-text" placeholder="Author" style={{flexGrow: 1}} value={props.embed.author} onChange={(v) => props.onChange({author: v})} />
                </div>
                <EditorField className="Embed-title" placeholder="Title" value={props.embed.title} onChange={(v) => props.onChange({title: v})} />
                <EditorField className="Embed-description" placeholder="Description" value={props.embed.description} onChange={(v) => props.onChange({description: v})} />
                <div className="Embed-fields">
                    {fields}
                </div>
                <div className="EmbedEditor-field-actions">
                    <button onClick={() => addField(false)}>Add field</button> <button onClick={() => addField(true)}>Add inline field</button>
                </div>
                <div className="Embed-media">
                    <Button theme="secondary icon"><OutlinedAddPhotoAlternativeIcon /></Button>
                </div>
                <div className="Embed-thumbnail">
                    <Button theme="secondary icon"><OutlinedAddPhotoAlternativeIcon /></Button>
                </div>
                <div className="Embed-footer">
                    <EditorField className="Embed-footer-text" placeholder="Footer" style={{flexGrow: 1}} value={props.embed.footer} onChange={(v) => props.onChange({footer: v})} />
                </div>
            </div>
        </div>
    );
}