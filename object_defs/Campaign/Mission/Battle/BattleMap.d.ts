import { NetworkableJSONObject, NetworkableObject } from "../../../NetworkableObject";

declare class BattleMapInterface {
}

export interface BattleMapJSONObject extends BattleMapInterface, NetworkableJSONObject {}

declare class BattleMap extends BattleMapInterface implements NetworkableObject {
    constructor();
    toJSONObject(): BattleMapJSONObject;
    public static fromJSONObject(jsonObject: BattleMapJSONObject): BattleMap;
}

export default BattleMap;
