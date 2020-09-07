import {CSSProperties, useState} from "react";
import hsvToRgb from "hsv-rgb";
import React, {PointerEvent} from "react";
import "./ColorPicker.sass";
import {colorArrToString, parseColor} from "../util";
import rgbToHsv from "rgb-hsv";

let clamp = (v: number, min: number, max: number) => Math.max(Math.min(v, max), min);

export function HsvColorPicker(props: {hsv: [number, number, number], onHsvChange: (hsv: [number, number, number]) => void, style?: CSSProperties}) {
    let hueBaseColor = colorArrToString(hsvToRgb(props.hsv[0], 100, 100));
    let currentColor = colorArrToString(hsvToRgb(props.hsv[0], props.hsv[1], props.hsv[2]));

    let [pointerDown, setPointerDown] = useState(false);
    let onPointerDown = (e: PointerEvent) => {
        pointerDown = true;
        setPointerDown(true);
        if ((e.target as any).setPointerCapture)
            (e.target as any).setPointerCapture(e.pointerId);
        onPointerMove(e);

    };
    let onPointerMove = (e: PointerEvent) => {
        if (pointerDown) {
            let bbox = e.currentTarget.getBoundingClientRect();
            let s = (e.clientX - bbox.left) / e.currentTarget.scrollWidth;
            let v = (e.clientY - bbox.top) / e.currentTarget.scrollHeight;
            props.onHsvChange([props.hsv[0], clamp(s * 100, 0, 100), clamp(100 - v * 100, 0, 100)]);
        }
    };

    let [huePointerDown, setHuePointerDown] = useState(false);
    let onHuePointerDown = (e: PointerEvent) => {
        huePointerDown = true;
        setHuePointerDown(true);
        if ((e.target as any).setPointerCapture)
            (e.target as any).setPointerCapture(e.pointerId);
        onHuePointerMove(e);
    };
    let onHuePointerMove = (e: PointerEvent) => {
        if (huePointerDown) {
            let bbox = e.currentTarget.getBoundingClientRect();
            let hue = e.clientX - bbox.left;
            props.onHsvChange([clamp(hue / e.currentTarget.scrollWidth * 360, 0, 360), props.hsv[1], props.hsv[2]]);
        }
    };

    return (
        <div className="ColorPicker" style={props.style}>
            <div className="ColorPicker-sv" style={{background: hueBaseColor}}  onPointerDown={onPointerDown} onPointerUp={() => setPointerDown(false)} onPointerMove={onPointerMove}>
                <div className="ColorPicker-sv-white" />
                <div className="ColorPicker-sv-black" />
                <div className="ColorPicker-sv-handle-wrap">
                    <div className="ColorPicker-sv-handle" style={{left: props.hsv[1] + "%", top: (100 - props.hsv[2]) + "%", background: currentColor, borderColor: (props.hsv[1] < 40 && props.hsv[2] > 50 ? "#333" : "#fff")}} />
                </div>
            </div>
            <div className="ColorPicker-hue" onPointerDown={onHuePointerDown} onPointerUp={() => setHuePointerDown(false)} onPointerMove={onHuePointerMove}>
                <div className="ColorPicker-hue-handle-wrap">
                    <div className="ColorPicker-hue-handle" style={{left: (props.hsv[0] / 360 * 100) + "%", background: hueBaseColor}} />
                </div>
            </div>
        </div>
    )
}

function HsvAlphaColorPicker(props: {hsv: [number, number, number], onHsvChange: (hsv: [number, number, number]) => void, alpha: number, onAlphaChange: (alpha: number) => void, style?: CSSProperties}) {
    let colorRgb = hsvToRgb(props.hsv[0], props.hsv[1], props.hsv[2]);
    let [alphaPointerDown, setAlphaPointerDown] = useState(false);
    let onAlphaPointerDown = (e: PointerEvent) => {
        alphaPointerDown = true;
        setAlphaPointerDown(true);
        if ((e.target as any).setPointerCapture)
            (e.target as any).setPointerCapture(e.pointerId);
        onAlphaPointerMove(e);
    };
    let onAlphaPointerMove = (e: PointerEvent) => {
        if (alphaPointerDown) {
            let bbox = e.currentTarget.getBoundingClientRect();
            let alpha = e.clientY - bbox.top;
            props.onAlphaChange(clamp(1 - alpha / e.currentTarget.scrollHeight, 0, 1));
        }
    };
    return (
        <div className="HsvAlphaColorPicker" style={props.style}>
            <HsvColorPicker hsv={props.hsv} onHsvChange={props.onHsvChange} />
            <div className="ColorPicker-alpha" onPointerDown={onAlphaPointerDown} onPointerUp={() => setAlphaPointerDown(false)} onPointerMove={onAlphaPointerMove}>
                <div className="ColorPicker-alpha-colored" style={{background: `linear-gradient(to bottom, ${colorArrToString(colorRgb)} 0%, ${colorArrToString([...colorRgb, 0])} 100%)`}} />
                <div className="ColorPicker-alpha-handle-wrap">
                    <div className="ColorPicker-alpha-handle" style={{top: (100 - props.alpha * 100) + "%", background: colorArrToString(colorRgb)}} />
                </div>
            </div>
        </div>
    );
}

export function ColorPicker(props: {value: string, onChange?: (value: string) => void, style?: CSSProperties}) {
    let [hsv, setHsv] = useState<[number, number, number]>([0, 0, 0]);
    let hsvRgb = hsvToRgb(hsv[0], hsv[1], hsv[2]);
    let parsedValue = parseColor(props.value);
    if (parsedValue !== null && (parsedValue[0] !== hsvRgb[0] || parsedValue[1] !== hsvRgb[1] || parsedValue[2] !== hsvRgb[2])) {
        hsv = rgbToHsv(parsedValue[0], parsedValue[1], parsedValue[2]);
    }
    let alpha = parsedValue ? (parsedValue[3] / 255) : 1;
    let onHsvChange = (value: [number, number, number]) => {
        let rgb = [...hsvToRgb(value[0], value[1], value[2]), alpha];
        setHsv(value);
        props.onChange?.(colorArrToString(rgb));
    };
    let onAlphaChange = (value: number) => {
        let rgb = [...hsvRgb, value];
        props.onChange?.(colorArrToString(rgb));
    };
    return <HsvAlphaColorPicker hsv={hsv} onHsvChange={onHsvChange} alpha={alpha} onAlphaChange={onAlphaChange} style={props.style} />
}