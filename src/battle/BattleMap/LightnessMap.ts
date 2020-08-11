import { TileCoord } from "../BattleTypes";
import ClientBattleMap from "./ClientBattleMap";
import UnitManager from "../Managers/UnitManager";
import User from "../../../object_defs/User";
import { getManhattenDistance, tileCoordToInteger, integerToTileCoord, tileCoordToPosition } from "../BattleHelpers";
import { getTileSize } from "../BattleConstants";

type CoordWithLightLevel = {
    tileCoord: TileCoord;
    lightLevel: number;
}
export function getAllTilesVisibleAtLightLevel(mapSize: TileCoord, tileCoord: TileCoord, unitSize: TileCoord, lightLevel: number): Array<CoordWithLightLevel> {
    if (lightLevel === 0) {
        return [];
    }
    const tilesVisited: Record<number, CoordWithLightLevel> = {};
    const tilesToSearch: Array<CoordWithLightLevel> = [];
    for (let xOff = 0; xOff < unitSize.x; xOff++) {
        for (let yOff = 0; yOff < unitSize.y; yOff++) {
            const coord = { x: tileCoord.x + xOff, y: tileCoord.y + yOff };
            tilesVisited[tileCoordToInteger(coord, mapSize)] = { tileCoord: coord, lightLevel: lightLevel };
            tilesToSearch.push({ tileCoord: coord, lightLevel: lightLevel });
        }
    }

    while (tilesToSearch.length) {
        const currTile = tilesToSearch.shift();
        if (currTile.lightLevel > 1) {
            [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([xOff, yOff]) => {
                const nextTile = { x: currTile.tileCoord.x + xOff, y: currTile.tileCoord.y + yOff };
                const positionNumber = tileCoordToInteger(nextTile, mapSize);
                if (
                    nextTile.x >= 0 && nextTile.y >= 0 &&
                    nextTile.x < mapSize.x && nextTile.y < mapSize.y &&
                    !tilesVisited[positionNumber]
                ) {
                    tilesToSearch.push({ tileCoord: nextTile, lightLevel: currTile.lightLevel - 1 });
                    tilesVisited[positionNumber] = { tileCoord: nextTile, lightLevel: currTile.lightLevel - 1 };
                }
            });
        }
    }
    return Object.values(tilesVisited);
}

export default class LightnessMap {
    mapSize: TileCoord;
    // Maps a tile-number to the lightness level there.
    lightLevels: Record<number, number>;
    lightSprites: Array<PIXI.Sprite>;
    visibility: Record<number, boolean>;
    constructor(mapSize: TileCoord) {
        this.mapSize = { ...mapSize };
        this.lightLevels = {}; //
        this.lightSprites = [];
        this.visibility = [];
    }

    update(
        clientBattleMap: ClientBattleMap,
        unitManager: UnitManager,
        user: User,
    ) {
        this.lightLevels = {};
        const playerUnits = unitManager.getPlayerUnits();
        const userOwnsAnyUnits = playerUnits.find(unit => unit.owner === user.id) !== undefined;
        playerUnits.forEach(unit => {
            if (!userOwnsAnyUnits || unit.owner === user.id || unit.team === 'allies') {
                if (unit.team === 'players' && (!userOwnsAnyUnits || unit.owner === user.id)) {
                    const unitSize = unit.getUnitSize();
                    for (let x = unit.tileCoord.x; x < unit.tileCoord.x + unitSize.x; x++) {
                        this.visibility[tileCoordToInteger({ x, y: unit.tileCoord.y - 1 }, this.mapSize)] = true;
                        this.visibility[tileCoordToInteger({ x, y: unit.tileCoord.y + unitSize.y}, this.mapSize)] = true;
                    }

                    for (let y = unit.tileCoord.y; y < unit.tileCoord.y + unitSize.y; y++) {
                        this.visibility[tileCoordToInteger({ x: unit.tileCoord.x - 1, y }, this.mapSize)] = true;
                        this.visibility[tileCoordToInteger({ x: unit.tileCoord.x + unitSize.x, y }, this.mapSize)] = true;
                    }
                    for (let x = unit.tileCoord.x; x < unit.tileCoord.x + unitSize.x; x++) {
                        for (let y = unit.tileCoord.y; y < unit.tileCoord.y + unitSize.y; y++) {
                            this.visibility[tileCoordToInteger({ x, y }, this.mapSize)] = true;
                        }
                    }
                }
                const unitLightLevel = unit.getLightLevel();
                const visibleTiles = getAllTilesVisibleAtLightLevel(this.mapSize, unit.tileCoord, unit.getUnitSize(), unitLightLevel);
                visibleTiles.forEach((coordWithLightLevel: CoordWithLightLevel) => {
                    const positionNumber = tileCoordToInteger(coordWithLightLevel.tileCoord, this.mapSize);
                    const lightLevelAtTile = coordWithLightLevel.lightLevel;
                    if (lightLevelAtTile <= 0) {
                        debugger; // This shouldn't happen -- investigate.
                        throw new Error("This shouldn't happen");
                    }
                    this.visibility[positionNumber] = true;
                    if (this.lightLevels[positionNumber]) {
                        this.lightLevels[positionNumber] = Math.max(
                            this.lightLevels[positionNumber],
                            lightLevelAtTile,
                        )
                    } else {
                        this.lightLevels[positionNumber] = lightLevelAtTile;
                    }
                })
            }
        });
    }

    getLightLevel(tile: TileCoord): number {
        const positionNumber = tileCoordToInteger(tile, this.mapSize);

        if (!this.lightLevels[positionNumber]) { return 0; }
        return this.lightLevels[positionNumber];
    }

    getVisible(tile: TileCoord): boolean {
        const positionNumber = tileCoordToInteger(tile, this.mapSize);

        if (!this.visibility[positionNumber]) { return false; }
        return this.visibility[positionNumber];
    }

    updateDarknessContainer(darknessContainer: PIXI.Sprite, clientBattleMap: ClientBattleMap) {
        const tileSize = getTileSize();
        const mapSize = clientBattleMap.getMapSize();
        if (this.lightSprites.length === 0) {   
            for (let y = 0; y < mapSize.y; y++) {
                for (let x = 0; x < mapSize.x; x++) {
                    const spritePos = tileCoordToPosition({ x, y });
                    const gt = new PIXI.Graphics();
                    gt.beginFill(0x0);//, lightLevel <= 1 ? 0.5 : 0);
                    gt.drawRect(0, 0, tileSize.x, tileSize.y);
                    gt.endFill();

                    const graphicsSprite = new PIXI.Sprite();
                    graphicsSprite.position.x = spritePos.x;
                    graphicsSprite.position.y = spritePos.y;
                    graphicsSprite.addChild(gt);
                    graphicsSprite.alpha = 1;
                    darknessContainer.addChild(graphicsSprite);

                    const positionNumber = tileCoordToInteger({ x, y }, clientBattleMap.getMapSize());
                    if (this.lightSprites[positionNumber]) {
                        throw new Error("Duplicate thingy");
                    }
                    this.lightSprites[positionNumber] = graphicsSprite;
                }
            }
        }

        for (let x = 0; x < mapSize.x; x++) {
            for (let y = 0; y < mapSize.y; y++) {
                const visible = this.getVisible({ x, y });
                const lightLevel = this.getLightLevel({ x, y });
                const positionNumber = tileCoordToInteger({ x, y }, clientBattleMap.getMapSize());
                let alphaLevel = 0.75;
                if (visible) {
                    if (lightLevel > 2) {
                        alphaLevel = 0;
                    } else if (lightLevel > 1) {
                        alphaLevel = 0.1;
                    } else if (lightLevel > 0) {
                        alphaLevel = 0.3
                    } else {
                        alphaLevel = 0.5;
                    }
                }
                this.lightSprites[positionNumber].alpha = alphaLevel;
            }
        }
    }
}