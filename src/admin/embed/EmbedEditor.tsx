import React, {ReactNode, useCallback, useMemo} from "react";
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
    fields: [{name: createDefaultNodes(), value: createDefaultNodes()}, {name: createDefaultNodes(), value: createDefaultNodes()}],
    fieldLayout: [{inline: true}, {inline: true}]
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

export function EmbedEditor(props: {embed: EditableEmbed, onChange: (embed: Partial<EditableEmbed>) => void}) {
    const decorateWithNamePlaceholder = useDecorateWithPlaceholder("Name");
    const decorateWithValuePlaceholder = useDecorateWithPlaceholder("Value");
    const decorateWithAuthorPlaceholder = useDecorateWithPlaceholder("Author");
    const decorateWithTitlePlaceholder = useDecorateWithPlaceholder("Title");
    const decorateWithDescriptionPlaceholder = useDecorateWithPlaceholder("Description");
    const decorateWithFooterPlaceholder = useDecorateWithPlaceholder("Footer");

    const fieldRows = splitFields(props.embed.fieldLayout || []);

    const authorEditor = useMemo(() => withReact(createEditor()), []);
    const titleEditor = useMemo(() => withReact(createEditor()), []);
    const descriptionEditor = useMemo(() => withReact(createEditor()), []);
    const footerEditor = useMemo(() => withReact(createEditor()), []);
    const fieldKeyEditors = useMemo(() => Array.from({ length: props.embed.fieldLayout.length }, () => withReact(createEditor()) ), [props.embed.fieldLayout]);
    const fieldValueEditors = useMemo(() => Array.from({ length: props.embed.fieldLayout.length }, () => withReact(createEditor()) ), [props.embed.fieldLayout]);

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
                <Slate editor={fieldKeyEditors[k]} value={props.embed.fields[k].name} onChange={(v) => updateField(k, {name: v})}>
                    <Editable className="Embed-field-name" renderLeaf={renderLeaf} decorate={decorateWithNamePlaceholder} />
                </Slate>
                <Slate editor={fieldValueEditors[k]} value={props.embed.fields[k].value} onChange={(v) => updateField(k, {value: v})}>
                    <Editable className="Embed-field-value" renderLeaf={renderLeaf} decorate={decorateWithValuePlaceholder} />
                </Slate>
            </div>;
        })
    ));


    return (
        <div className="Embed-wrapper">
            <div className="Embed Embed-withThumbnail EmbedEditor">
                <div className="Embed-author">
                    <Slate editor={authorEditor} value={props.embed.author} onChange={(v) => props.onChange({author: v})}>
                        <Editable className="Embed-author-text" style={{flexGrow: 1}} renderLeaf={renderLeaf} decorate={decorateWithAuthorPlaceholder} />
                    </Slate>
                </div>
                <Slate editor={titleEditor} value={props.embed.title} onChange={(v) => props.onChange({title: v})}>
                    <Editable className="Embed-title" renderLeaf={renderLeaf} decorate={decorateWithTitlePlaceholder} />
                </Slate>
                <Slate editor={descriptionEditor} value={props.embed.description} onChange={(v) => props.onChange({description: v})}>
                    <Editable className="Embed-description" renderLeaf={renderLeaf} decorate={decorateWithDescriptionPlaceholder} />
                </Slate>
                <div className="Embed-fields">
                    {fields}
                </div>
                <div className="EmbedEditor-field-actions">
                    <a href="#">Add field</a> <a href="#">Add inline field</a>
                </div>
                <div className="Embed-media">
                    <Button theme="secondary icon"><OutlinedAddPhotoAlternativeIcon /></Button>
                </div>
                <div className="Embed-thumbnail">
                    <Button theme="secondary icon"><OutlinedAddPhotoAlternativeIcon /></Button>
                </div>
                <div className="Embed-footer">
                    <Slate editor={footerEditor} value={props.embed.footer} onChange={(v) => props.onChange({footer: v})}>
                        <Editable className="Embed-footer-text" style={{flexGrow: 1}} renderLeaf={renderLeaf} decorate={decorateWithFooterPlaceholder} />
                    </Slate>
                </div>
            </div>
        </div>
    );
}