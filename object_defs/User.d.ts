declare class User {
    name: string;
    id: number;
    constructor(id: number, name: string);

    toJSONObject(): UserJSONObject;

    getUserUri(): string;

    public static fromJSONObject(jsonObject: UserJSONObject): User;

}

export interface UserJSONObject {
    _v: number;
    id: number;
    name: string;
}

export default User;
