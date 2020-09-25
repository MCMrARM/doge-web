import React, {CSSProperties, ReactNode, useCallback, useMemo} from "react";
import {createEditor, Editor, Node as SlateNode, NodeEntry, Range} from "slate";
import {RenderLeafProps} from "slate-react/dist/components/editable";
import {DefaultLeaf, Editable, Slate, withReact} from "slate-react";

export const useDecorateWithPlaceholder = (placeholder: string) => {
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
};

export const renderLeafWithPlaceholder = (props: RenderLeafProps) => {
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

export function EditorField(props: {className: string, style?: CSSProperties, value: SlateNode[], placeholder: string, onChange: (value: SlateNode[]) => void}) {
    const editor = useMemo(() => withReact(createEditor()), []);
    const decorate = useDecorateWithPlaceholder(props.placeholder);
    return (
        <Slate editor={editor} value={props.value} onChange={props.onChange}>
            <Editable className={props.className} style={props.style} renderLeaf={renderLeafWithPlaceholder} decorate={decorate} />
        </Slate>
    );
}