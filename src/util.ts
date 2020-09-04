export function colorIntToHexString(color: number) {
    return "#" + color.toString(16).padStart(6, "0");
}

export function colorArrToString(arr: number[]) {
    return "#" + (arr[0].toString(16).padStart(2, "0")) + (arr[1].toString(16).padStart(2, "0")) + (arr[2].toString(16).padStart(2, "0"));
}