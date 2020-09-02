import {BotConfig} from "./shared/BotConfig";

export class ResponseError extends Error {}

export default class ApiClient {

    static instance: ApiClient;
    private baseUrl: string;

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

    async getServerConfig(serverId: string): Promise<BotConfig> {
        return (await fetch(this.baseUrl + `${encodeURIComponent(serverId)}/admin/config`)
            .then(this.jsonErrorTransform)) as BotConfig;
    }

}

ApiClient.instance = new ApiClient("http://localhost:3000/");