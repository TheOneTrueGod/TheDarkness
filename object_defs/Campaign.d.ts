declare class Campaign {
    name: string;
    constructor(name: string);

    toNetworkObject(): CampaignNetworkObject;

    public static fromNetworkObject(networkObject: CampaignNetworkObject): Campaign;

}

export interface CampaignNetworkObject {
    _v: number;
    name: string;
}

export default Campaign;
