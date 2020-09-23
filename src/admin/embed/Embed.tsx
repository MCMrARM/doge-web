import React from "react";
import "./Embed.sass";

export type EmbedField = {
    name: string,
    value: string,
    inline?: boolean
}
export type EmbedInfo = {
    author?: {
        name?: string,
        icon_url?: string,
    },
    title?: string,
    description?: string,
    fields?: EmbedField[],
    image?: {
        url?: string
    },
    thumbnail?: {
        url?: string
    },
    footer?: {
        text?: string,
        icon_url?: string
    }
}

export function splitFields(fields: EmbedField[]) {
    const embedRows = [];
    let currentRow = [];
    let lastInline = false;
    for (const field of fields) {
        if ((currentRow.length === 3 || !field.inline || !lastInline) && currentRow.length > 0) {
            embedRows.push(currentRow);
            currentRow = [];
        }
        lastInline = field.inline || false;
        currentRow.push(field);
    }
    if (currentRow.length > 0)
        embedRows.push(currentRow);
    return embedRows;
}

export function Embed(props: {embed: EmbedInfo}) {
    const fieldRows = splitFields(props.embed.fields || []);

    return (
        <div className="Embed-wrapper">
            <div className="Embed Embed-withThumbnail">
                {props.embed.author?.name && <div className="Embed-author">
                    {props.embed.author.icon_url && <img src={props.embed.author.icon_url} alt="" className="Embed-author-icon" />}
                    <span className="Embed-author-text">{props.embed.author.name}</span>
                </div>}
                {props.embed.title && <div className="Embed-title">{props.embed.title}</div>}
                {props.embed.description && <div className="Embed-description">{props.embed.description}</div>}
                {fieldRows.length > 0 && <div className="Embed-fields">
                    {fieldRows.flatMap((list, i) => (
                        list.map((x, j) => {
                            const units = 6 / list.length;
                            return <div className="Embed-field" key={"field-" + i + "-" + j} style={{gridColumn: `${1 + units * j}/${1 + units * (j + 1)}`}}>
                                <div className="Embed-field-name">{x.name}</div>
                                <div className="Embed-field-value">{x.value}</div>
                            </div>;
                        })
                    ))}
                </div>}
                {props.embed.image?.url && <img src={props.embed.image.url} alt="" className="Embed-media" />}
                {props.embed.thumbnail?.url && <img src={props.embed.thumbnail.url} alt="" className="Embed-thumbnail" />}
                {props.embed.footer?.text && <div className="Embed-footer">
                    <img src={props.embed.footer.icon_url} alt="" className="Embed-footer-icon" />
                    <span className="Embed-footer-text">{props.embed.footer.text}</span>
                </div>}
            </div>
        </div>
    );
}