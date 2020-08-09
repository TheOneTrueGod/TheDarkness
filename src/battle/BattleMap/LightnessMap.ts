import { TileCoord } from "../BattleTypes";
import ClientBattleMap from "./ClientBattleMap";
import UnitManager from "../Managers/UnitManager";
import User from "../../../object_defs/User";
import { getManhattenDistance, tileCoordToInteger, integerToTileCoord, tileCoordToPosition } from "../BattleHelpers";
import { getTileSize } from "../BattleConstants";

function getAllTilesVisibleAtDistance(mapSize: TileCoord, tileCoord: TileCoord, distance: number): Array<TileCoord> {
    const tilesVisited = {[tileCoordToInteger(tileCoord, mapSize)]: tileCoord};
    const tilesToSearch = [tileCoord];
    while (tilesToSearch.length) {
        const currTile = tilesToSearch.shift();
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([xOff, yOff]) => {
            const nextTile = { x: currTile.x + xOff, y: currTile.y + yOff };
            const positionNumber = tileCoordToInteger(nextTile, mapSize);
            if (
                nextTile.x >= 0 && nextTile.y >= 0 &&
                nextTile.x < mapSize.x && nextTile.y < mapSize.y &&
                !tilesVisited[positionNumber] &&
                getManhattenDistance(
                    tileCoord,
                    nextTile
                ) < distance
            ) {
                tilesToSearch.push(nextTile)
                tilesVisited[positionNumber] = nextTile;
            }
        });
    }
    return Object.values(tilesVisited);
}

export default class LightnessMap {
    mapSize: TileCoord;
    // Maps a tile-number to the lightness level there.
    lightLevels: Record<number, number>;
    lightSprites: Array<PIXI.Sprite>;
    constructor(mapSize: TileCoord) {
        this.mapSize = { ...mapSize };
        this.lightLevels = {}; //
        this.lightSprites = [];
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
                const unitLightLevel = unit.getLightLevel();
                const visibleTiles = getAllTilesVisibleAtDistance(this.mapSize, unit.tileCoord, unitLightLevel);
                visibleTiles.forEach((tile: TileCoord) => {
                    const positionNumber = tileCoordToInteger(tile, this.mapSize);
                    const lightLevelAtTile = unitLightLevel - getManhattenDistance(unit.tileCoord, tile)
                    if (lightLevelAtTile <= 0) {
                        debugger; // This shouldn't happen -- investigate.
                        throw new Error("This shouldn't happen");
                    }
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
                const lightLevel = this.getLightLevel({ x, y });
                const positionNumber = tileCoordToInteger({ x, y }, clientBattleMap.getMapSize());
                if (lightLevel > 2) {
                    this.lightSprites[positionNumber].alpha = 0;
                } else if (lightLevel > 1) {
                    this.lightSprites[positionNumber].alpha = 0.1;
                } else if (lightLevel > 0) {
                    this.lightSprites[positionNumber].alpha = 0.5;
                } else {
                    this.lightSprites[positionNumber].alpha = 0.75;
                }
            }
        }
    }
}