import * as PIXI from 'pixi.js';
import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap.js";
import BattleConstants from "../BattleConstants";
import { SpriteList } from "../SpriteUtils";
import { TileCoord } from '../BattleTypes.js';

function getMapSize(battleMap: BattleMap): TileCoord {
    return { x: 80, y: 60 };
}

function getTerrainSprite(terrainTexture: PIXI.Texture, terrainType: number): PIXI.Sprite {
    const imageSize = { x: 32, y: 32 };
    const tileFramePosition = { x: 1, y: 3 };
    const t32Rect = new PIXI.Rectangle(
        imageSize.x * tileFramePosition.x,
        imageSize.y * tileFramePosition.y,
        imageSize.x,
        imageSize.y
    );
    
    const framedTexture = new PIXI.Texture(terrainTexture.baseTexture, t32Rect);

    const terrainSprite = new PIXI.Sprite(framedTexture);
    return terrainSprite;
}

export function renderBattleMap(
    battleMap: BattleMap,
    terrainContainer: PIXI.Sprite,
    pixiLoader: PIXI.Loader,
) {
    const { x: tileSizeX, y: tileSizeY } = BattleConstants.getTileSize();
    const { x: mapSizeX, y: mapSizeY } = getMapSize(battleMap);

    for (let x = 0; x < mapSizeX; x++) {
        for (let y = 0; y < mapSizeY; y++) {
            const terrainSprite = getTerrainSprite(
                pixiLoader.resources[SpriteList.TERRAIN].texture,
                0
            );
            terrainSprite.position.x = x * tileSizeX;
            terrainSprite.position.y = y * tileSizeY;
            terrainSprite.width = tileSizeX;
            terrainSprite.height = tileSizeY;
            terrainContainer.addChild(
                terrainSprite
            );
        }
    }
};

export function getBattleMapTileSize(battleMap: BattleMap) {
    return { x: 40, y: 60 };
}