import {BotConfig} from "./shared/BotConfig";
import {ServerInfo} from "./shared/ServerInfo";
import {LeaderboardData} from "./shared/LeaderboardData";
import {ApiEmbed} from "./shared/ApiEmbed";

export class ResponseError extends Error {}

interface ApiAuthProvider {
    getAppJwt(): string|undefined;
}

export interface ImageUploadRequest {
    on(type: "progress", cb: (uploaded: number, total: number) => void): void;
    on(type: "error", cb: () => void): void;
    on(type: "end", cb: (name: string) => void): void;
    send(): void;
}

export default class ApiClient {

    static instance: ApiClient;
    private baseUrl: string;
    authProvider?: ApiAuthProvider;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private jsonErrorTransform = async (x: Response) => {
        if (x.status === 200) {
            return x.json()
        } else {
            let jsonData: any;
            try {
                jsonData = await x.json();
            } catch(e) {
                throw Error("HTTP " + x.status + " " + x.statusText);
            }
            if (jsonData === null || !jsonData.message)
                throw Error("HTTP " + x.status + " " + x.statusText);
            throw new ResponseError(jsonData.message);
        }
    };

    private createAuthHeader(): {[key: string]: string} {
        let appJwt = this.authProvider?.getAppJwt();
        return appJwt ? {"Authorization": "Bearer " + appJwt} : {};
    }

    private async get(url: string): Promise<any> {
        return (await fetch(this.baseUrl + url, {
            headers: {
                ...this.createAuthHeader()
            }
        })
            .then(this.jsonErrorTransform));
    }

    private async post(url: string, body: BodyInit, contentType: string = "application/json"): Promise<any> {
        let contentTypeHeader = {};
        if (contentType !== "undefined")
            contentTypeHeader = {"Content-Type": contentType};
        return (await fetch(this.baseUrl + url, {
            method: "POST",
            body: body,
            headers: {
                ...contentTypeHeader,
                ...this.createAuthHeader()
            }
        })
            .then(this.jsonErrorTransform));
    }

    async getServerInfo(serverId: string): Promise<ServerInfo> {
        return this.get(`servers/${encodeURIComponent(serverId)}/admin/server`);
    }

    async getServerConfig(serverId: string): Promise<BotConfig> {
        return this.get(`servers/${encodeURIComponent(serverId)}/admin/config`);
    }

    async uploadServerConfig(serverId: string, config: BotConfig, images: {[key: string]: string}): Promise<BotConfig> {
        let configJson: any = config;
        if (Object.keys(images).length > 0)
            configJson = {...config, "$images": images};
        return this.post(`servers/${encodeURIComponent(serverId)}/admin/config`, JSON.stringify(configJson));
    }

    async postEmbed(serverId: string, channelId: string, content: string, embed: string, attachments: [string, File][]): Promise<void> {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("embed", embed);
        for (const attachment of attachments)
            formData.append("attachment", attachment[1], attachment[0]);
        return this.post(`servers/${encodeURIComponent(serverId)}/admin/embeds/${encodeURIComponent(channelId)}`, formData, "undefined");
    }

    async getEmbedList(serverId: string, channelId: string): Promise<ApiEmbed[]> {
        return this.get(`servers/${encodeURIComponent(serverId)}/admin/embeds/${encodeURIComponent(channelId)}`);
    }

    async getLeaderboard(serverId: string, after?: number|string): Promise<LeaderboardData> {
        if (after)
            return this.get(`servers/${encodeURIComponent(serverId)}/leaderboard?after=${encodeURIComponent(after)}`);
        return this.get(`servers/${encodeURIComponent(serverId)}/leaderboard`);
    }

    getWelcomeCardImagePath(serverId: string): string {
        return this.baseUrl + `servers/${encodeURIComponent(serverId)}/admin/images/welcome_banner`;
    }

    uploadWelcomeCardImage(serverId: string, file: File): ImageUploadRequest {
        let progressCb: ((uploaded: number, total: number) => void) | null = null;
        let errorCb: (() => void) | null = null;
        let endCb: ((name: string) => void) | null = null;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.baseUrl + `servers/${encodeURIComponent(serverId)}/admin/images/welcome_banner`, true);
        xhr.responseType = 'json';
        for (const [k, v] of Object.entries(this.createAuthHeader()))
            xhr.setRequestHeader(k, v);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.addEventListener("load", (e) => {
            console.log("Image upload complete", xhr.status, xhr.response);
            if (xhr.status !== 200) {
                errorCb?.();
                return;
            }
            endCb?.(xhr.response["name"]);
        });
        xhr.addEventListener("error", (e) => {
            console.log("Image upload failed");
            errorCb?.();
        });
        xhr.addEventListener("progress", (e) => {
            progressCb?.(e.loaded, e.total);
        });

        return {
            on: (listenerName: string, listener: any) => {
                if (listenerName === "progress")
                    progressCb = listener;
                else if (listenerName === "error")
                    errorCb = listener;
                else if (listenerName === "end")
                    endCb = listener;
            },
            send: () => {
                xhr.send(file);
            }
        };
    }

}

ApiClient.instance = new ApiClient(process.env["REACT_APP_API_BASE_URL"]!);