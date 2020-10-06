import React, {CSSProperties, PointerEvent, ReactNode, useState} from "react";
import {createContext, createRef, RefObject, useContext, useLayoutEffect, useRef} from "react";

interface ItemInfo {
    innerRef: RefObject<HTMLElement>,
    onUpdate: () => void,
    data: any,
    positions: string[]
}

const positions: {[key: string]: (x: DOMRectReadOnly) => number} = {
    "above": (x) => x.top,
    "below": (x) => x.bottom
};
const allPositions = ["above", "below"];

export type DragDropCallback = (
    from: any,
    to: any,
    position: string
) => void;

class DragData {

    readonly items: {[key: string]: ItemInfo} = {};
    currentHoverItem?: [string, string];
    draggingItem?: string;
    draggingItemHeight?: number;
    draggingItemPlaceholderRef = createRef<HTMLElement>();
    onDrop?: DragDropCallback;

    setDraggingItem(item: string | undefined, newValue: number) {
        this.draggingItem = item;
        this.draggingItemHeight = newValue;
        if (this.currentHoverItem)
            this.items[this.currentHoverItem[0]]?.onUpdate();
    }

    setDropTarget(newTarget: [string, string] | undefined) {
        if (this.currentHoverItem === newTarget || (newTarget && this.currentHoverItem &&
            newTarget[0] === this.currentHoverItem[0] && newTarget[1] === this.currentHoverItem[1]))
            return;
        if (this.currentHoverItem)
            this.items[this.currentHoverItem[0]]?.onUpdate();
        this.currentHoverItem = newTarget;
        if (this.currentHoverItem)
            this.items[this.currentHoverItem[0]]?.onUpdate();
    }

    findDropTarget(nearClientY: number): [string, string] | undefined {
        let closestKey: string | null = null;
        let closestPosition: string | null = null;
        let closestDist = Number.MAX_VALUE;
        for (const k of Object.keys(this.items)) {
            const el = this.items[k];
            const ref = this.draggingItem !== k ? el.innerRef : this.draggingItemPlaceholderRef;
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                for (const p of el.positions) {
                    const y = positions[p](rect);
                    const dist = Math.abs(nearClientY - y);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestKey = k;
                        closestPosition = p;
                    }
                }
            }
        }
        return closestKey && closestPosition ? [closestKey, closestPosition] : undefined;
    }

}

const DragDataContext = createContext<DragData|null>(null);

export function DragContext(props: {children: ReactNode | ReactNode[], onDrop: DragDropCallback}) {
    const dragData = useRef<DragData | null>(null);
    if (!dragData.current)
         dragData.current = new DragData();
    dragData.current.onDrop = props.onDrop;
    return <DragDataContext.Provider value={dragData.current}>
        {props.children}
    </DragDataContext.Provider>;
}

export function DragItem(props: {
    dragKey: string,
    placeholderClassName?: string,
    data: any,
    positions?: string[],
    children: (
        provided: {
            ref: RefObject<HTMLElement>,
            dragStyle: CSSProperties,
            dragging: boolean,
            droppingOver: boolean,
            events: {
                onPointerDown: (e: PointerEvent) => void,
                onPointerMove: (e: PointerEvent) => void,
                onPointerUp: () => void
            }
        }
    ) => any
}) {
    const dragData = useContext(DragDataContext)!;
    let [dragging, setDragging] = useState<[boolean, number, number, number, number]>([false, 0, 0, 0, 0]);

    const setForceRerender = useState([])[1];
    const ref = createRef<HTMLElement>();
    useLayoutEffect(() => {
        dragData.items[props.dragKey] = {
            data: props.data,
            positions: props.positions || allPositions,
            innerRef: ref,
            onUpdate: () => {
                setForceRerender([]);
            }
        };
        return () => { delete dragData.items[props.dragKey]; };
    });

    const ret = props.children({
        ref,
        dragStyle: dragging[0] ? {
            position: "absolute",
            left: dragging[1],
            top: dragging[2],
            zIndex: 100000
        } : {},
        dragging: dragging[0],
        droppingOver: dragData.currentHoverItem?.[0] === props.dragKey,
        events: {
            onPointerDown: (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                dragData.setDraggingItem(props.dragKey, (e.currentTarget as any).offsetHeight);
                dragData.setDropTarget([props.dragKey, "above"]);
                setDragging([true, r.left, r.top, e.clientX - r.left, e.clientY - r.top]);
                if ((e.target as any).setPointerCapture)
                    (e.target as any).setPointerCapture(e.pointerId);
            },
            onPointerMove: (e) => {
                if (dragging[0]) {
                    const h = (e.currentTarget as any).offsetHeight;
                    dragData.setDraggingItem(props.dragKey, h);
                    dragData.setDropTarget(dragData.findDropTarget(e.clientY - dragging[4] + h / 2));
                    setDragging([true, e.clientX - dragging[3], e.clientY - dragging[4], dragging[3], dragging[4]]);
                }
            },
            onPointerUp: () => {
                if (dragData.currentHoverItem)
                    dragData.onDrop?.(props.data, dragData.items[dragData.currentHoverItem[0]].data, dragData.currentHoverItem[1]);
                dragData.setDraggingItem(undefined, 0);
                dragData.setDropTarget(undefined);
                setDragging([false, 0, 0, 0, 0]);
            }
        }
    });

    return (
        <React.Fragment>
            {dragData.currentHoverItem?.[0] === props.dragKey && dragData.currentHoverItem[1] === "above" && <div className={props.placeholderClassName} style={{height: dragData.draggingItemHeight + "px"}} />}
            {dragData.draggingItem === props.dragKey && <span ref={dragData.draggingItemPlaceholderRef} />}
            <React.Fragment key="content">{ret}</React.Fragment>
            {dragData.currentHoverItem?.[0] === props.dragKey && dragData.currentHoverItem[1] === "below" && <div className={props.placeholderClassName} style={{height: dragData.draggingItemHeight + "px"}} />}
        </React.Fragment>
    )
}