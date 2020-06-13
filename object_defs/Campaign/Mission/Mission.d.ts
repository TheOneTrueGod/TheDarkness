import { NetworkableJSONObject, NetworkableObject } from "../../NetworkableObject";
import MissionUnit from "./MissionUnit";

export declare type MissionStateEnum = 'planning' | 'active' | 'finished';
export declare const MissionState: { [key in MissionStateEnum]: MissionStateEnum };

declare class MissionInterface {
    readonly id: number;
    readonly campaignId: number;
    readonly creatorId: number;

    missionState: MissionStateEnum;

    pastBattleIds: Array<number>;
    activeBattleId: number;
    battleIndex: number;

    unitList: Array<MissionUnit>;
}

export interface MissionJSONObject extends MissionInterface, NetworkableJSONObject {}

declare class Mission extends MissionInterface implements NetworkableObject {
    constructor(id: number, campaignId: number, creatorId: number);
    toJSONObject(): MissionJSONObject;
    public static fromJSONObject(jsonObject: MissionJSONObject): Mission;
}

export default Mission;
