import React, {createRef, CSSProperties, FocusEvent, useState} from 'react';
import {Input} from "./Input";
import "./ColorInput.sass";
import {ExpandMoreIcon} from "../icons/Icons";
import {ColorPicker} from "./ColorPicker";

export function ColorInput(props: { style?: CSSProperties, className?: string, value: string, placeholder?: string, onChange?: (value: string) => void }) {
    let [showPicker, setShowPicker] = useState(false);
    let [hsv, setHsv] = useState<[number, number, number]>([0, 0, 0]);
    let ctrRef = createRef<HTMLDivElement>();
    let onFocus = () => {
        setShowPicker(true);
    };
    let onBlur = (ev: FocusEvent<HTMLElement>) => {
        if (!ctrRef.current!.contains(ev.relatedTarget as Node)) {
            setShowPicker(false);
        }
    };
    return (
        <div ref={ctrRef} className={"ColorInput-ctr" + (showPicker ? " ColorInput-ctr-expanded" : "")}>
            <Input
                className={"ColorInput" + (props.className ? ` ${props.className}` : "")}
                style={props.style}
                placeholder={props.placeholder}
                value={props.value}
                onValueChange={props.onChange}
                onFocus={onFocus}
                onBlur={onBlur} />
            <ExpandMoreIcon className="ColorInput-expandIcon" />
            {showPicker && (
                <div className="ColorInput-picker" tabIndex={0} onBlur={onBlur}><ColorPicker hsv={hsv} onHsvChange={setHsv} /></div>
            )}
        </div>
    );
}
