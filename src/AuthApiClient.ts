import {ResponseError} from "./ApiClient";

export type LoginResponse = {
    appJwt: string,
    user: {
        id: string,
        username: string,
        avatar: string
    }
};
export type GuildListEntry = {
    id: string,
    name: string,
    icon: string
};

export default class AuthApiClient {

    static clientId = "736597967535996970";
    static instance: AuthApiClient;
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

    async login(code: string): Promise<LoginResponse> {
        return (await fetch(this.baseUrl + `login`, {
            method: "POST",
            body: JSON.stringify({
                code: code
            }),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        }).then(this.jsonErrorTransform)) as LoginResponse;
    }

    async logout(): Promise<{}> {
        return (await fetch(this.baseUrl + `logout`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        }).then(this.jsonErrorTransform)) as {};
    }

    async getGuilds(): Promise<GuildListEntry[]> {
        return (await fetch(this.baseUrl + `guilds`, {
            method: "GET",
            credentials: 'include'
        }).then(this.jsonErrorTransform)) as GuildListEntry[];
    }

}

AuthApiClient.instance = new AuthApiClient(process.env["REACT_APP_AUTH_API_BASE_URL"]!);