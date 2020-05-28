export interface NetworkableJSONObject {
    readonly _v: number;
}

export declare class NetworkableObject {
    toJSONObject(): NetworkableJSONObject;
    public static fromJSONObject(jsonObject: NetworkableJSONObject): NetworkableObject;
}