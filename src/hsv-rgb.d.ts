declare module 'rgb-hsv' {
    export default function hsv(r: number, g: number, b: number): [number, number, number];
}
declare module 'hsv-rgb' {
    export default function rgb(h: number, s: number, v: number): [number, number, number];
}