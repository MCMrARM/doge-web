export function generateRandomHexString(length?: number) {
    let arr = new Uint8Array(length || 8);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (x) => x.toString(16).padStart(2, "0")).join('');
}