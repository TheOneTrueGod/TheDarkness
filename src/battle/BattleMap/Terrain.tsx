import * as PIXI from 'pixi.js';
import { getTileSize } from "../BattleConstants";
import { SpriteList } from "../SpriteUtils";
import { TileCoord } from '../BattleTypes.js';
import ClientBattleMap from './ClientBattleMap.js';

function getMapSize(clientBattleMap: ClientBattleMap): TileCoord {
    return { x: clientBattleMap.size.x, y: clientBattleMap.size.y };
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
    clientBattleMap: ClientBattleMap,
    terrainContainer: PIXI.Sprite,
    pixiLoader: PIXI.Loader,
) {
    const { x: tileSizeX, y: tileSizeY } = getTileSize();
    const { x: mapSizeX, y: mapSizeY } = getMapSize(clientBattleMap);

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

export function getBattleMapTileSize(clientBattleMap: ClientBattleMap) {
    return { x: 40, y: 60 };
}