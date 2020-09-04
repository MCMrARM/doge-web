import {ServerInfo} from "../shared/ServerInfo";
import {WelcomeBannerConfig, WelcomeConfig} from "../shared/BotConfig";
import {ContactIcon, MoveIcon, ResizeIcon, ArrowExpandHorizontalIcon} from "../icons/Icons";
import {TwoColumnOption} from "./TwoColumnOption";
import {ChannelDropdown} from "./components/ChannelDropdown";
import React, {PointerEvent, ReactNode, ReactNodeArray, useLayoutEffect, useRef, useState} from "react";
import ApiClient from "../ApiClient";
import "./WelcomeCard.sass";
import {NumberInput} from "./components/NumberInput";

const defaultBanner: WelcomeBannerConfig = {
    avatarLeft: 0,
    avatarTop: 0,
    avatarSize: 64,
    textColor: "#fff",
    textLeft: 0,
    textWidth: 100,
    textCenterTop: 64,
    textMinSize: 16,
    textMaxSize: 64,
    textShadowOffsetLeft: 2,
    textShadowOffsetTop: 2,
    textShadowColor: "#000",
    font: "Roboto"
};

function ResizableArea(props: {left: number, top: number, width: number, height: number, sizeRule?: (w: number, h: number) => [number, number], onChange: (left: number, top: number, width: number, height: number) => void, children: ReactNode|ReactNodeArray}) {
    let [dragging, setDragging] = useState<[boolean, number, number]>([false, 0, 0]);
    let onDragPointerDown = (e: PointerEvent) => {
        setDragging([true, e.pageX - props.left, e.pageY - props.top]);
        if ((e.target as any).setPointerCapture)
            (e.target as any).setPointerCapture(e.pointerId);
    };
    let onDragPointerMove = (e: PointerEvent) => {
        if (dragging[0]) {
            props.onChange(e.pageX - dragging[1], e.pageY - dragging[2], props.width, props.height);
        }
    };
    let onDragPointerUp = () => {
        setDragging([false, 0, 0]);
    };

    let [resizing, setResizing] = useState<[boolean, number, number, number, number]>([false, 0, 0, 0, 0]);
    let onResizePointerDown = (e: PointerEvent) => {
        setResizing([true, e.pageX, e.pageY, props.width, props.height]);
        e.stopPropagation();
        if ((e.target as any).setPointerCapture)
            (e.target as any).setPointerCapture(e.pointerId);
    };
    let onResizePointerMove = (e: PointerEvent, xDir: number, yDir: number) => {
        if (resizing[0]) {
            let newW = (e.pageX - resizing[1]) * xDir + resizing[3];
            let newH = (e.pageY - resizing[2]) * yDir + resizing[4];
            newW = Math.max(newW, 0);
            newH = Math.max(newH, 0);
            if (props.sizeRule)
                [newW, newH] = props.sizeRule(newW, newH);
            props.onChange(props.left - (xDir < 0 ? (newW - props.width) : 0), props.top - (yDir < 0 ? (newH - props.height) : 0), newW, newH);
        }
    };
    let onResizePointerUp = () => {
        setResizing([false, 0, 0, 0, 0]);
    };

    return (
        <div className="ResizableArea" style={{left: `${props.left}px`, top: `${props.top}px`, width: `${props.width}px`, height: `${props.height}px` }} onPointerDown={onDragPointerDown} onPointerMove={onDragPointerMove} onPointerUp={onDragPointerUp}>
            {props.children}
            <div className="ResizeableArea-handle ResizeableArea-handle-tl" onPointerDown={onResizePointerDown} onPointerMove={(e) => onResizePointerMove(e, -1, -1)} onPointerUp={onResizePointerUp} />
            <div className="ResizeableArea-handle ResizeableArea-handle-tr" onPointerDown={onResizePointerDown} onPointerMove={(e) => onResizePointerMove(e, 1, -1)} onPointerUp={onResizePointerUp} />
            <div className="ResizeableArea-handle ResizeableArea-handle-bl" onPointerDown={onResizePointerDown} onPointerMove={(e) => onResizePointerMove(e, -1, 1)} onPointerUp={onResizePointerUp} />
            <div className="ResizeableArea-handle ResizeableArea-handle-br" onPointerDown={onResizePointerDown} onPointerMove={(e) => onResizePointerMove(e, 1, 1)} onPointerUp={onResizePointerUp} />
        </div>
    );
}

export function WelcomeCard(props: {server: ServerInfo, config: WelcomeConfig, onChange: (changes: Partial<WelcomeConfig>) => void}) {
    let [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
    let imageContainerRef = useRef<HTMLDivElement>(null);
    let [containerSize, setContainerSize] = useState<[number, number]>([0, 0]);
    useLayoutEffect(() => {
        setContainerSize([imageContainerRef.current!.offsetWidth, imageContainerRef.current!.offsetHeight]);
    }, [imageSize, imageContainerRef]);
    let mapCoord = (x: number) => x / imageSize[0] * containerSize[0];
    let unmapCoord = (x: number) => x * imageSize[0] / containerSize[0];
    console.log(imageSize, containerSize);
    let banner = props.config.banner || defaultBanner;
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><ContactIcon className="Icon"/> Welcome Card Settings</h1>
            <TwoColumnOption title="Welcome Card Channel" description="A message with the welcome card will be sent to the specified channel">
                <ChannelDropdown value={props.config.channel} server={props.server} noneOption="Disabled" onValueChanged={(v) => props.onChange({channel: v})} />
            </TwoColumnOption>
            <div className="WelcomeCard-editor">
                <div className="WelcomeCard-editor-image" ref={imageContainerRef}>
                    <img src={ApiClient.instance.getWelcomeCardImagePath(props.server.id)} onLoad={(i) => setImageSize([i.currentTarget.naturalWidth, i.currentTarget.naturalHeight])} />
                    <ResizableArea
                        left={mapCoord(banner.avatarLeft)}
                        top={mapCoord(banner.avatarTop)}
                        width={mapCoord(banner.avatarSize)}
                        height={mapCoord(banner.avatarSize)}
                        sizeRule={(w, h) => [Math.min(w, h), Math.min(w, h)]}
                        onChange={(l, t, w, h) => props.onChange({banner: {...banner, avatarLeft: Math.round(unmapCoord(l)), avatarTop: Math.round(unmapCoord(t)), avatarSize: Math.round(unmapCoord(w))}})}>
                        <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="Avatar" className="WelcomeCard-editor-avatar" />
                    </ResizableArea>
                    <ResizableArea
                        left={mapCoord(banner.textLeft)}
                        top={mapCoord(banner.textCenterTop - banner.textMaxSize / 2)}
                        width={mapCoord(banner.textWidth)}
                        height={mapCoord(banner.textMaxSize)}
                        onChange={(l, t, w, h) => props.onChange({banner: {...banner, textLeft: Math.round(unmapCoord(l)), textWidth: Math.round(unmapCoord(w))}})}>
                        <span style={{fontSize: mapCoord(banner.textMaxSize) + "px"}} className="WelcomeCard-editor-nickname">Username</span>
                    </ResizableArea>
                </div>
                <div className="WelcomeCard-editor-options">
                    <h4>User avatar</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <MoveIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.avatarLeft} onChange={(v) => props.onChange({banner: {...banner, avatarLeft: v}})} />
                        <NumberInput value={banner.avatarTop} onChange={(v) => props.onChange({banner: {...banner, avatarTop: v}})} style={{marginLeft: "4px"}} />
                        <ResizeIcon className="Icon" style={{marginLeft: "16px", marginRight: "8px"}} />
                        <NumberInput value={banner.avatarSize} onChange={(v) => props.onChange({banner: {...banner, avatarSize: v}})} />
                    </div>
                    <h4>User nickname</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <MoveIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.textLeft} onChange={(v) => props.onChange({banner: {...banner, textLeft: v}})} />
                        <NumberInput value={banner.textCenterTop} onChange={(v) => props.onChange({banner: {...banner, textCenterTop: v}})} style={{marginLeft: "4px"}} />
                        <ArrowExpandHorizontalIcon className="Icon" style={{marginLeft: "16px", marginRight: "8px"}} />
                        <NumberInput value={banner.textWidth} onChange={(v) => props.onChange({banner: {...banner, textWidth: v}})} />
                    </div>
                </div>
            </div>
        </div>
    );
}