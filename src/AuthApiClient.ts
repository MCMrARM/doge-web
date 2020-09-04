import {ResponseError} from "./ApiClient";

export type LoginResponse = {
    appJwt: string,
    user: {
        id: string,
        username: string,
        avatar: string
    }
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

}

AuthApiClient.instance = new AuthApiClient("http://localhost:3004/api/v1/auth/");