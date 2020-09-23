import React, {useMemo, useState} from "react";
import {createEditor, Node as SlateNode} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import "./Embed.sass";

export type EditableEmbed = {
    author: SlateNode[],
    title: SlateNode[],
    description: SlateNode[],
    footer: SlateNode[]
};

const defaultNodes: SlateNode[] = [{ children: [{ text: '' }] }];
export const defaultEmbed: EditableEmbed = {
    author: defaultNodes,
    title: defaultNodes,
    description: defaultNodes,
    footer: defaultNodes
};

export function EmbedEditor(props: {embed: EditableEmbed, onChange: (embed: Partial<EditableEmbed>) => void}) {
    const authorEditor = useMemo(() => withReact(createEditor()), []);
    const titleEditor = useMemo(() => withReact(createEditor()), []);
    const descriptionEditor = useMemo(() => withReact(createEditor()), []);
    const footerEditor = useMemo(() => withReact(createEditor()), []);

    return (
        <div className="Embed-wrapper">
            <div className="Embed" style={{minWidth: "100px"}}>
                <div className="Embed-author">
                    <Slate editor={authorEditor} value={props.embed.author} onChange={(v) => props.onChange({author: v})}>
                        <Editable className="Embed-author-text" placeholder="Author" style={{flexGrow: 1}} />
                    </Slate>
                </div>
                <Slate editor={titleEditor} value={props.embed.title} onChange={(v) => props.onChange({title: v})}>
                    <Editable className="Embed-title" placeholder="Title" />
                </Slate>
                <Slate editor={descriptionEditor} value={props.embed.description} onChange={(v) => props.onChange({description: v})}>
                    <Editable className="Embed-description" placeholder="Description" />
                </Slate>
                <div className="Embed-footer">
                    <Slate editor={footerEditor} value={props.embed.footer} onChange={(v) => props.onChange({footer: v})}>
                        <Editable className="Embed-footer-text" placeholder="Footer" style={{flexGrow: 1}} />
                    </Slate>
                </div>
            </div>
        </div>
    );
}