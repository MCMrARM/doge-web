import {BotConfig} from "./shared/BotConfig";
import {ServerInfo} from "./shared/ServerInfo";

export class ResponseError extends Error {}

interface ApiAuthProvider {
    getAppJwt(): string|undefined;
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

    async getServerInfo(serverId: string): Promise<ServerInfo> {
        return this.get(`servers/${encodeURIComponent(serverId)}/admin/server`);
    }

    async getServerConfig(serverId: string): Promise<BotConfig> {
        return this.get(`servers/${encodeURIComponent(serverId)}/admin/config`);
    }

    getWelcomeCardImagePath(serverId: string): string {
        return this.baseUrl + `servers/${encodeURIComponent(serverId)}/admin/images/welcomeCard`;
    }

}

ApiClient.instance = new ApiClient(process.env["REACT_APP_API_BASE_URL"]!);