declare class Campaign {
    name: string;
    id: number;
    constructor(id: number, name: string);

    toNetworkObject(): CampaignNetworkObject;

    getCampaignUri(): string;

    public static fromNetworkObject(networkObject: CampaignNetworkObject): Campaign;

}

export interface CampaignNetworkObject {
    _v: number;
    id: number;
    name: string;
}

export default Campaign;
