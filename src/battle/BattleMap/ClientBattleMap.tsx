import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";
import LightnessMap from './LightnessMap';
import { TileCoord } from "../BattleTypes";
import UnitManager from "../Managers/UnitManager";
import User from "../../../object_defs/User";
import BaseAbility from "../UnitAbilities/BaseAbility";
import BattleUnit from "../BattleUnits/BattleUnit";
import TerrainSprite, { TerrainEffects } from "./TerrainSprite";
import { tileCoordToInteger } from "../BattleHelpers";

export default class ClientBattleMap {
    mapSize: { x: number, y: number };
    lightnessMap: LightnessMap;
    terrainSprites: Record<number, TerrainSprite>;
    constructor(battleMap: BattleMap) {
        this.mapSize = { x: battleMap.mapSize.x, y: battleMap.mapSize.y };
        this.lightnessMap = new LightnessMap({ ...this.mapSize });
        this.terrainSprites = [];
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
        return this.lightnessMap.getVisible(tile);
    }

    createTerrain(terrainContainer: PIXI.Sprite, pixiLoader: PIXI.Loader) {
        const { x: mapSizeX, y: mapSizeY } = this.getMapSize();

        for (let x = 0; x < mapSizeX; x++) {
            for (let y = 0; y < mapSizeY; y++) {
                const terrainSprite = new TerrainSprite({ x, y }, pixiLoader);
                terrainSprite.addToContainer(terrainContainer);

                this.terrainSprites[tileCoordToInteger({ x, y }, this.getMapSize())] = terrainSprite;
            }
        }
    }

    getMapSize(): TileCoord {
        return { ...this.mapSize };
    }

    // Previews of abilities
    showAbilitySelectedState(ability: BaseAbility, user: BattleUnit) {
        const displayDetails = ability.getDisplayDetails();
        const mapSize = this.getMapSize();

        const tilesInRange = ability.getTilesInRange(user);
        tilesInRange.forEach((tile) => {
            if (tile.x >= 0 && tile.x < mapSize.x && tile.y >= 0 && tile.y < mapSize.y) {
                this.terrainSprites[tileCoordToInteger(tile, mapSize)].showTerrainEffect(TerrainEffects.TARGETTER_MOVE);
            }
        });
    }
}