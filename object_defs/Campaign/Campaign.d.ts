import { NetworkableJSONObject, NetworkableObject } from "../NetworkableObject";

declare class CampaignInterface {
    readonly id: number;
    readonly name: string;
    playerIds: Array<number>;
    activeMissionIds: Array<number>;
    missionIndex: number;
}

export interface CampaignJSONObject extends CampaignInterface, NetworkableJSONObject {}

declare class Campaign extends CampaignInterface implements NetworkableObject {
    constructor(id: number, name: string);

    toJSONObject(): CampaignJSONObject;

    getCampaignUri(): string;

    public static fromJSONObject(jsonObject: CampaignJSONObject): Campaign;

}

export default Campaign;
