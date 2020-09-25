export function colorIntToHexString(color: number) {
    return "#" + color.toString(16).padStart(6, "0");
}

export function colorIntToArr(rgb: number): [number, number, number] {
    return [(rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, (rgb >> 0) & 0xFF];
}

export function colorArrToNumber(arr: [number, number, number]): number {
    return (arr[0] << 16) | (arr[1] << 8) | arr[2];
}

export function colorArrToString(arr: number[]) {
    if (arr.length > 3 && arr[3] !== 1) {
        return "rgba(" + arr[0].toString() + "," + arr[1].toString() + "," + arr[2].toString() + "," + arr[3].toString() + ")";
    }
    return "#" + (arr[0].toString(16).padStart(2, "0")) + (arr[1].toString(16).padStart(2, "0")) + (arr[2].toString(16).padStart(2, "0"));
}

export function parseColor(str: string): [number, number, number, number] | null {
    if (str.match(/^#[0-9a-fA-F]{6}$/)) {
        let rgb = parseInt(str.substr(1), 16);
        return [(rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, (rgb >> 0) & 0xFF, 255];
    }
    if (str.match(/^#[0-9a-fA-F]{8}$/)) {
        let rgb = parseInt(str.substr(1), 16);
        return [(rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, (rgb >> 0) & 0xFF, (rgb >> 24) & 0xFF];
    }
    let parseFnC = (x: string) => {
        if (x.endsWith("%")) return parseInt(x.substr(0, x.length - 1)) / 100 * 255;
        return parseInt(x);
    };
    let m = str.match(/^\s*rgb\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*\)\s*$/);
    if (m)
        return [parseFnC(m[1]), parseFnC(m[2]), parseFnC(m[3]), 255];
    m = str.match(/^\s*rgba\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+)\s*\)\s*$/);
    if (m)
        return [parseFnC(m[1]), parseFnC(m[2]), parseFnC(m[3]), parseFloat(m[4]) * 255];
    return null;
}
(window as any).parseColor = parseColor;