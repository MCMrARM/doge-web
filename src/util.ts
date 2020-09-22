/* eslint-disable react-hooks/exhaustive-deps */
import {DependencyList, useEffect, useState} from "react";

export function generateRandomHexString(length?: number) {
    let arr = new Uint8Array(length || 8);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (x) => x.toString(16).padStart(2, "0")).join('');
}

export function useObjectURL(file: File|null) {
    const [objectURL, setObjectURL] = useState<string|null>(null);
    useEffect(() => {
        const url = file ? URL.createObjectURL(file) : null;
        setObjectURL(url);
        return () => { url && URL.revokeObjectURL(url); };
    }, [file]);
    return objectURL;
}

export function usePageScrollCallback(cb: () => void, deps: DependencyList) {
    useEffect(() => {
        window.addEventListener("scroll", cb);
        return () => {
            window.removeEventListener("scroll", cb);
        };
    }, [cb].concat(deps));
}