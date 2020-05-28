import { NetworkableJSONObject, NetworkableObject } from "../../NetworkableObject";

declare enum MissionState {
    planning = 'planning',
    active = 'active',
    finished = 'finished',
}

declare class MissionInterface {
    readonly id: number;
    readonly campaignId: number;
    readonly creatorId: number;

    missionState: MissionState;

    pastBattleIds: Array<number>;
    activeBattleId: number;
    battleIndex: number;
}

export interface MissionJSONObject extends MissionInterface, NetworkableJSONObject {}

declare class Mission extends MissionInterface implements NetworkableObject {
    constructor(id: number, campaignId: number, creatorId: number);
    toJSONObject(): MissionJSONObject;
    public static fromJSONObject(jsonObject: MissionJSONObject): Mission;
}

export default Mission;
