import { NetworkableJSONObject, NetworkableObject } from "../../NetworkableObject";

declare class MissionUnitInterface {
    readonly ownerId: number;
    readonly unitId: number;
    readonly unitName: string;
    readonly ownerName: string;
}

export interface MissionUnitJSONObject extends MissionUnitInterface, NetworkableJSONObject {}

declare class MissionUnit extends MissionUnitInterface implements NetworkableObject {
    constructor(ownerId: number, unitId: number, unitName: string, ownerName: string);
    toJSONObject(): MissionUnitJSONObject;
    public static fromJSONObject(jsonObject: MissionUnitJSONObject): MissionUnit;
}

export default MissionUnit;
