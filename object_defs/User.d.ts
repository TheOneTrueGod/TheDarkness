declare class User {
    name: string;
    id: number;
    constructor(id: number, name: string);

    toNetworkObject(): UserNetworkObject;

    getUserUri(): string;

    public static fromNetworkObject(networkObject: UserNetworkObject): User;

}

export interface UserNetworkObject {
    _v: number;
    id: number;
    name: string;
}

export default User;
