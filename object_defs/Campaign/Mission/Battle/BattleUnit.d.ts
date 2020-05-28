import { NetworkableJSONObject, NetworkableObject } from "../../../NetworkableObject";

declare class BattleUnitInterface {
    readonly id: number;
}

export interface BattleUnitJSONObject extends BattleUnitInterface, NetworkableJSONObject {}

declare class BattleUnit extends BattleUnitInterface implements NetworkableObject {
    constructor(id: number, campaignId: number, missionId: number);
    toJSONObject(): BattleUnitJSONObject;
    public static fromJSONObject(jsonObject: BattleUnitJSONObject): BattleUnit;
}

export default BattleUnit;
