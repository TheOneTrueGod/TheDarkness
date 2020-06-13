import { NetworkableJSONObject, NetworkableObject } from "../NetworkableObject";
import CampaignUnit from "./CampaignUnit";

declare class CampaignInterface {
    readonly id: number;
    readonly name: string;
    playerIds: Array<number>;
    activeMissionIds: Array<number>;
    missionIndex: number;
    unitIndex: number;
    campaignUnits: Array<CampaignUnit>;
}

export interface CampaignJSONObject extends CampaignInterface, NetworkableJSONObject {}

declare class Campaign extends CampaignInterface implements NetworkableObject {
    constructor(id: number, name: string);

    toJSONObject(): CampaignJSONObject;

    getCampaignUri(): string;

    public static fromJSONObject(jsonObject: CampaignJSONObject): Campaign;

}

export default Campaign;
