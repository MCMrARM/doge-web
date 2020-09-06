export function colorIntToHexString(color: number) {
    return "#" + color.toString(16).padStart(6, "0");
}

export function colorArrToString(arr: number[]) {
    return "#" + (arr[0].toString(16).padStart(2, "0")) + (arr[1].toString(16).padStart(2, "0")) + (arr[2].toString(16).padStart(2, "0"));
}

export function parseColor(str: string): [number, number, number, number] | null {
    if (str.match(/$#[0-9a-fA-F]{8}^/)) {
        let rgb = parseInt(str.substr(1), 16);
        return [(rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, (rgb >> 0) & 0xFF, 255];
    }
    return null;
}