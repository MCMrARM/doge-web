import {ServerInfo} from "../shared/ServerInfo";
import {WelcomeConfig} from "../shared/BotConfig";
import {
    ContactIcon,
    MoveIcon,
    ResizeIcon,
    ArrowExpandHorizontalIcon,
    FormatSizeIcon,
    PaletteIcon, BlurIcon, CancelIcon
} from "../icons/Icons";
import {TwoColumnOption} from "./TwoColumnOption";
import {ChannelDropdown} from "./components/ChannelDropdown";
import React, {
    FocusEvent,
    PointerEvent,
    ReactNode,
    ReactNodeArray,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import ApiClient from "../ApiClient";
import "./WelcomeCard.sass";
import {NumberInput} from "./components/NumberInput";
import {Button} from "../components/Button";
import {SimpleDropdown} from "./components/SimpleDropdown";
import {Input} from "../components/Input";
import {ColorPicker} from "../components/ColorPicker";
import {ColorInput} from "../components/ColorInput";
import {ImageUploadButton} from "./components/ImageUploadButton";
import {useObjectURL} from "../util";

const availableFonts = new Map(Object.entries({
    "Roboto": "Roboto",
    "Roboto Bold": "Roboto Bold",
    "Raleway": "Raleway"
}));

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

function ShadowColorDropdown(props: {value: string, onChange: (value: string) => void}) {
    let [visible, setVisible] = useState(false);
    let dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (visible)
            dropdownRef.current?.focus();
    }, [visible]);
    let onBlur = (ev: FocusEvent) => { if (!ev.currentTarget.contains(ev.relatedTarget as Node)) setVisible(false) };
    return (
        <>
            <Button theme="colorless icon" style={{alignSelf: "stretch", marginLeft: "8px"}} onClick={() => setVisible(true)} ><PaletteIcon className="Icon" style={{width: "16px", height: "16px"}} /></Button>
            {visible && <div ref={dropdownRef} className="WelcomeCard-editor-shadow-color-dropdown" tabIndex={0} onBlur={onBlur}>
                <ColorPicker value={props.value} onChange={props.onChange} />
                <Input type={"text"} value={props.value} onValueChange={props.onChange} style={{marginTop: "16px", fontSize: "12px", padding: "4px 8px"}} />
            </div>}
        </>
    );
}

export function WelcomeCard(props: {server: ServerInfo, config: WelcomeConfig, onChange: (changes: Partial<WelcomeConfig>) => void, onSetImage: (key: string, value: string, file: File) => void, overrideImages: {[key: string]: [string, File]}}) {
    let previewFileUrl = useObjectURL(props.overrideImages["welcome_banner"]?.[1] || null);
    let [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
    let imageContainerRef = useRef<HTMLDivElement>(null);
    let [containerSize, setContainerSize] = useState<[number, number]>([0, 0]);
    useLayoutEffect(() => {
        setContainerSize([imageContainerRef.current!.offsetWidth, imageContainerRef.current!.offsetHeight]);
    }, [imageSize, imageContainerRef]);
    let mapCoord = (x: number) => x / imageSize[0] * containerSize[0];
    let unmapCoord = (x: number) => x * imageSize[0] / containerSize[0];
    let [minFontSizeFocused, setMinFontSizeFocused] = useState(false);
    let banner = props.config.banner || props.server.fallbackBannerConfig;
    let textResizableAreaH = minFontSizeFocused ? banner.textMinSize : banner.textMaxSize;
    return (
        <div className="AdminPage">
            <h1 className="AdminPage-Title"><ContactIcon className="Icon"/> Welcome Card Settings</h1>
            <TwoColumnOption title="Welcome Card Channel" description="A message with the welcome card will be sent to the specified channel">
                <ChannelDropdown value={props.config.channel} server={props.server} noneOption="Disabled" onValueChanged={(v) => props.onChange({channel: v})} />
            </TwoColumnOption>
            <div className="WelcomeCard-editor">
                <div style={{flexGrow: 1}}>
                    <div className="WelcomeCard-editor-image" ref={imageContainerRef}>
                        <img src={previewFileUrl || ApiClient.instance.getWelcomeCardImagePath(props.server.id)} onLoad={(i) => setImageSize([i.currentTarget.naturalWidth, i.currentTarget.naturalHeight])} />
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
                            top={mapCoord(banner.textCenterTop - textResizableAreaH / 2)}
                            width={mapCoord(banner.textWidth)}
                            height={mapCoord(textResizableAreaH)}
                            sizeRule={(w, h) => [w, mapCoord(textResizableAreaH)]}
                            onChange={(l, t, w, h) => props.onChange({banner: {...banner, textLeft: Math.round(unmapCoord(l)), textWidth: Math.round(unmapCoord(w)), textCenterTop: Math.round(unmapCoord(t + h / 2)), textMaxSize: Math.round(unmapCoord(h))}})}>
                            <span style={{
                                fontSize: mapCoord(minFontSizeFocused ? banner.textMinSize : banner.textMaxSize) + "px",
                                color: banner.textColor,
                                textShadow: `${mapCoord(banner.textShadowOffsetLeft)}px ${mapCoord(banner.textShadowOffsetTop)}px ${mapCoord(banner.textShadowBlur)}px ${banner.textShadowColor}`
                            }} className="WelcomeCard-editor-nickname">Username</span>
                        </ResizableArea>
                    </div>
                    <div style={{marginTop: "8px"}}><ImageUploadButton uploader={(f) => ApiClient.instance.uploadWelcomeCardImage(props.server.id, f)} onUploaded={(v, file) => props.onSetImage("welcome_banner", v, file)} /></div>
                </div>
                <div className="WelcomeCard-editor-options">
                    <h4>User avatar</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <MoveIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.avatarLeft} onValueChange={(v) => props.onChange({banner: {...banner, avatarLeft: v}})} />
                        <NumberInput value={banner.avatarTop} onValueChange={(v) => props.onChange({banner: {...banner, avatarTop: v}})} style={{marginLeft: "4px"}} />
                        <ResizeIcon className="Icon" style={{marginLeft: "16px", marginRight: "8px"}} />
                        <NumberInput value={banner.avatarSize} onValueChange={(v) => props.onChange({banner: {...banner, avatarSize: v}})} />
                    </div>
                    <h4>User nickname</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <MoveIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.textLeft} onValueChange={(v) => props.onChange({banner: {...banner, textLeft: v}})} />
                        <NumberInput value={banner.textCenterTop} onValueChange={(v) => props.onChange({banner: {...banner, textCenterTop: v}})} style={{marginLeft: "4px"}} />
                        <ArrowExpandHorizontalIcon className="Icon" style={{marginLeft: "16px", marginRight: "8px"}} />
                        <NumberInput value={banner.textWidth} onValueChange={(v) => props.onChange({banner: {...banner, textWidth: v}})} />
                    </div>
                    <h4>Font</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <FormatSizeIcon className="Icon" style={{marginRight: "8px"}} />
                        <SimpleDropdown value={banner.font} map={availableFonts} onValueChanged={(v)=> props.onChange({banner: {...banner, font: v}})} />
                    </div>
                    <h4>Nickname font size range</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <FormatSizeIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.textMinSize} onValueChange={(v) => props.onChange({banner: {...banner, textMinSize: v}})} onFocus={() => setMinFontSizeFocused(true)} onBlur={() => setMinFontSizeFocused(false)} />
                        <span style={{margin: "0 8px"}}>-</span>
                        <NumberInput value={banner.textMaxSize} onValueChange={(v) => props.onChange({banner: {...banner, textMaxSize: v}})} />
                    </div>
                    <h4>Nickname color</h4>
                    <div className="WelcomeCard-editor-options-row">
                        <PaletteIcon className="Icon" style={{marginRight: "8px"}} />
                        <ColorInput value={banner.textColor} onChange={(v)=> props.onChange({banner: {...banner, textColor: v}})} />
                    </div>
                    <h4>Nickname shadow</h4>
                    <div className="WelcomeCard-editor-options-row" style={{position: "relative"}}>
                        <MoveIcon className="Icon" style={{marginRight: "8px"}} />
                        <NumberInput value={banner.textShadowOffsetLeft} onValueChange={(v) => props.onChange({banner: {...banner, textShadowOffsetLeft: v}})} />
                        <NumberInput value={banner.textShadowOffsetTop} onValueChange={(v) => props.onChange({banner: {...banner, textShadowOffsetTop: v}})} style={{marginLeft: "4px"}} />
                        <BlurIcon className="Icon" style={{marginLeft: "12px", marginRight: "8px"}} />
                        <NumberInput value={banner.textShadowBlur} onValueChange={(v) => props.onChange({banner: {...banner, textShadowBlur: v}})} />
                        <ShadowColorDropdown value={banner.textShadowColor} onChange={(v) => props.onChange({banner: {...banner, textShadowColor: v}})}/>
                    </div>
                </div>
            </div>
        </div>
    );
}