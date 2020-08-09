import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";
import LightnessMap from './LightnessMap';
import { TileCoord } from "../BattleTypes";
import UnitManager from "../Managers/UnitManager";
import User from "../../../object_defs/User";

export default class ClientBattleMap {
    mapSize: { x: number, y: number };
    lightnessMap: LightnessMap;
    constructor(battleMap: BattleMap) {
        this.mapSize = { x: battleMap.mapSize.x, y: battleMap.mapSize.y };
        this.lightnessMap = new LightnessMap({ ...this.mapSize });
    }

    convertToBattleMap(): BattleMap {
        const map = new BattleMap();
        map.mapSize = { ...this.mapSize };
        return map;
    }

    isTileEmpty(tileCoord: TileCoord): boolean {
        return true;
    }

    updateLightnessLevels(darknessContainer: PIXI.Sprite, unitManager: UnitManager, user: User) {
        this.lightnessMap.update(this, unitManager, user);
        this.lightnessMap.updateDarknessContainer(darknessContainer, this);
    }

    isTileVisible(tile: TileCoord): boolean {
        return this.lightnessMap.getLightLevel(tile) > 0;
    }

    getMapSize(): TileCoord {
        return { ...this.mapSize };
    }
}