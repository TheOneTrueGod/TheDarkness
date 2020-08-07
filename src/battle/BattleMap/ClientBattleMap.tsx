import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";
import { TileCoord } from "../BattleTypes";

export default class ClientBattleMap {
    size: { x: number, y: number };
    constructor(battleMap: BattleMap) {
        this.size = { x: battleMap.mapSize.x, y: battleMap.mapSize.y };
    }

    convertToBattleMap(): BattleMap {
        const map = new BattleMap();
        map.mapSize = { x: this.size.x, y: this.size.y };
        return map;
    }

    isTileEmpty(tileCoord: TileCoord): boolean {
        return true;
    }
}