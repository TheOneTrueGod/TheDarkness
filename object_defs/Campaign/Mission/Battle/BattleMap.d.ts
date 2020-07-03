import { NetworkableJSONObject, NetworkableObject } from "../../../NetworkableObject";
import { TileCoord } from "../../../../src/battle/BattleTypes";

declare class BattleMapInterface {
    mapSize: TileCoord
}

export interface BattleMapJSONObject extends BattleMapInterface, NetworkableJSONObject {
}

declare class BattleMap extends BattleMapInterface implements NetworkableObject {
    constructor();
    toJSONObject(): BattleMapJSONObject;
    public static fromJSONObject(jsonObject: BattleMapJSONObject): BattleMap;
}

export default BattleMap;
