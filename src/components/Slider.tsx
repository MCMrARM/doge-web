import React, {PointerEvent} from 'react';
import "./Slider.sass";

export function Slider(props: { value: number, min: number, max: number, labels?: [number, string][], onValueChanged: (value: number) => void }) {
    const labels = props.labels?.map(x => {
        return <div className="Slider-label" style={{left: `${(x[0] - props.min) / (props.max - props.min) * 100}%`}}>{x[1]}</div>;
    }) || [];
    let slider = React.createRef<HTMLDivElement>();
    let [isDragging, setIsDragging] = React.useState(false);
    const onPointerDown = (event: PointerEvent) => {
        event.preventDefault();
        setIsDragging(true);
        if ((event.target as any).setPointerCapture)
            (event.target as any).setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
        if (isDragging) {
            event.preventDefault();
            let rect = slider.current!.getBoundingClientRect();
            props.onValueChanged(Math.min(Math.max( (event.clientX - rect.x) / rect.width * (props.max - props.min) + props.min, props.min), props.max));
        }
    };
    const onPointerUp = (event: PointerEvent) => {
        event.preventDefault();
        setIsDragging(false);
    };
    return (
        <div ref={slider} className="Slider" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            <div className="Slider-handle" style={{left: `${(props.value - props.min) / (props.max - props.min) * 100}%`}} />
            {labels}
        </div>
    );
}