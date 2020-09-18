import React, {useState} from 'react';
import "./NumberInput.sass";
import {Button} from "../../components/Button";
import {ImageUploadRequest} from "../../ApiClient";

export function ImageUploadButton(props: {uploader: (file: File) => ImageUploadRequest, onUploaded: (name: string, file: File) => void}) {
    let [uploading, setUploading] = useState(false);
    let openDialog = () => {
        if (uploading)
            return;

        let input = document.createElement("input");
        input.type = "file";
        input.onchange = (ev) => {
            if (!input.files || input.files.length === 0 || uploading)
                return;
            uploading = true;
            setUploading(true);

            const file = input.files[0];
            const up = props.uploader(file);
            up.on("end", (name) => {
                props.onUploaded(name, file);
                setUploading(false);
            });
            up.on("error", () => {
                setUploading(false);
            });
            up.send();
        };
        input.click();
    };

    if (uploading) {
        return (
            <Button disabled={true} onClick={openDialog}>Uploading...</Button>
        );
    }
    return (
        <Button onClick={openDialog}>Upload new image</Button>
    );
}
