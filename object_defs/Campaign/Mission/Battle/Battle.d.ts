import { NetworkableJSONObject, NetworkableObject } from "../../../NetworkableObject";
import BattleMap, { BattleMapJSONObject } from "./BattleMap";
import { TileCoord } from "../../../../src/battle/BattleTypes";

declare class BattleInterface {
    readonly id: number;
    readonly campaignId: number;
    readonly missionId: number;
    caravanPosition: TileCoord;
}

export interface BattleJSONObject extends BattleInterface, NetworkableJSONObject {
    battleMap: BattleMapJSONObject;
}

declare class Battle extends BattleInterface implements NetworkableObject {
    battleMap: BattleMap;
    constructor(id: number, campaignId: number, missionId: number, initialize: boolean);
    toJSONObject(): BattleJSONObject;
    public static fromJSONObject(jsonObject: BattleJSONObject): Battle;
}

export default Battle;
