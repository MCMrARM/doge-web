import React, {createRef, CSSProperties, FocusEvent, useState} from 'react';
import {Input} from "./Input";
import "./ColorInput.sass";
import {ExpandMoreIcon} from "../icons/Icons";
import {ColorPicker} from "./ColorPicker";
import hsvToRgb from "hsv-rgb";
import rgbToHsv from "rgb-hsv";
import {colorArrToString, parseColor} from "../util";

export function ColorInput(props: { style?: CSSProperties, className?: string, value: string, placeholder?: string, onChange?: (value: string) => void }) {
    let [showPicker, setShowPicker] = useState(false);
    let [hsv, setHsv] = useState<[number, number, number]>([0, 0, 0]);
    let hsvRgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
    let parsedValue = parseColor(props.value);
    if (parsedValue !== null && (parsedValue[0] !== hsvRgb[0] || parsedValue[1] !== hsvRgb[1] || parsedValue[2] !== hsvRgb[2])) {
        hsv = rgbToHsv(parsedValue[0], parsedValue[1], parsedValue[2]);
    }

    let ctrRef = createRef<HTMLDivElement>();
    let onFocus = () => {
        setShowPicker(true);
    };
    let onBlur = (ev: FocusEvent<HTMLElement>) => {
        if (!ctrRef.current!.contains(ev.relatedTarget as Node)) {
            setShowPicker(false);
        }
    };
    let onHsvChange = (value: [number, number, number]) => {
        let rgb = hsvToRgb(value[0], value[1], value[2]);
        setHsv(value);
        props.onChange?.(colorArrToString(rgb));
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
                <div className="ColorInput-picker" tabIndex={0} onBlur={onBlur}><ColorPicker hsv={hsv} onHsvChange={onHsvChange} /></div>
            )}
        </div>
    );
}
