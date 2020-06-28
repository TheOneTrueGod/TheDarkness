import { NetworkableJSONObject, NetworkableObject } from "../../NetworkableObject";
import MissionUnit from "./MissionUnit";

import { MissionEvent } from "./EventData";

export declare type MissionStateEnum = 'planning' | 'active' | 'finished';
export declare const MissionState: { [key in MissionStateEnum]: MissionStateEnum };

export declare type Cargo = {
    type: number;
    weight: number;
};

export declare type Caravan = {
    unitSlots: number;
    unitList: Array<MissionUnit>;

    cargoList: Array<Cargo>;
    weightLimit: number;
};

declare class MissionInterface {
    readonly id: number;
    readonly campaignId: number;
    readonly creatorId: number;

    missionState: MissionStateEnum;

    events: Array<MissionEvent>;
    currentEvent?: MissionEvent;

    caravan: Caravan;
}

export interface MissionJSONObject extends MissionInterface, NetworkableJSONObject {}

declare class Mission extends MissionInterface implements NetworkableObject {
    constructor(id: number, campaignId: number, creatorId: number);
    toJSONObject(): MissionJSONObject;
    public static fromJSONObject(jsonObject: MissionJSONObject): Mission;
    public setupAsActive(): void;
}

export default Mission;
