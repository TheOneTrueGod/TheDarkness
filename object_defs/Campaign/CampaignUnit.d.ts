import { NetworkableJSONObject, NetworkableObject } from "../../NetworkableObject";

declare class CampaignUnitInterface {
    readonly ownerId: number;
    readonly unitId: number;
    readonly unitName: string;
    readonly ownerName: string;
}

export interface CampaignUnitJSONObject extends CampaignUnitInterface, NetworkableJSONObject {}

declare class CampaignUnit extends CampaignUnitInterface implements NetworkableObject {
    constructor(ownerId: number, unitId: number, unitName: string, ownerName: string);
    toJSONObject(): CampaignUnitJSONObject;
    public static fromJSONObject(jsonObject: CampaignUnitJSONObject): CampaignUnit;
}

export default CampaignUnit;
