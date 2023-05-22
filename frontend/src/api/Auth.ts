export class Auth {
    getAccessToken(): string {
        return window.localStorage.getItem("access_token");
    }

    setAccessToken(token: string) {
        window.localStorage.setItem("access_token", token);
    }
}

export const auth = new Auth();