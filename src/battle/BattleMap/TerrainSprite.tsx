import * as PIXI from 'pixi.js';
import { SpriteList } from '../SpriteUtils';
import { getTileSize } from '../BattleConstants';
import { TileCoord } from '../BattleTypes';

export enum TerrainEffects {
    TARGETTER_MOVE = 'targetter_move',
    TARGETTER_ATTACK = 'targetter_attack',
}

declare const TerrainEffectNames: { [key in TerrainEffects]: undefined };

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

export default class TerrainSprite {
    containerSprite: PIXI.Sprite;
    tileCoord: TileCoord;
    terrainEffects: Record<TerrainEffects, (PIXI.Sprite | undefined)>;
    pixiLoader: PIXI.Loader

    constructor(tileCoord: TileCoord, pixiLoader: PIXI.Loader) {
        const { x: tileSizeX, y: tileSizeY } = getTileSize();
        this.tileCoord = tileCoord;

        this.containerSprite = new PIXI.Sprite();
        this.containerSprite.position.x = this.tileCoord.x * tileSizeX;
        this.containerSprite.position.y = this.tileCoord.y * tileSizeY;

        this.createTerrainSprite(pixiLoader);
        
        this.pixiLoader = pixiLoader;
        // @ts-ignore
        this.terrainEffects = Object.keys(TerrainEffects).map((key: string) => undefined);
    }

    addToContainer(terrainContainer: PIXI.Sprite) {
        if (this.containerSprite.parent) {
            throw new Error("Can't have multiple parents.");
        }
        terrainContainer.addChild(this.containerSprite);
    }

    showTerrainEffect(terrainEffect: TerrainEffects) {
        if (this.terrainEffects[terrainEffect] === undefined) {
            this.terrainEffects[terrainEffect] = this.getTerrainEffectSprite(terrainEffect);
        }
        this.terrainEffects[terrainEffect].visible = true;
    }

    getTerrainEffectSprite(terrainEffect: TerrainEffects): PIXI.Sprite {
        const { x: tileSizeX, y: tileSizeY } = getTileSize();

        let sprite = null;
        switch (terrainEffect) {
            case TerrainEffects.TARGETTER_ATTACK:
                sprite = new PIXI.Sprite(this.pixiLoader.resources[SpriteList.CROSSHAIR].texture);
            case TerrainEffects.TARGETTER_MOVE:
                sprite = new PIXI.Sprite(this.pixiLoader.resources[SpriteList.POSITION_MARKER].texture);
        }
        sprite.width = tileSizeX;
        sprite.height = tileSizeY;
        sprite.visible = false;
        this.containerSprite.addChild(sprite);
        return sprite;
    }

    createTerrainSprite(pixiLoader: PIXI.Loader) {
        const { x: tileSizeX, y: tileSizeY } = getTileSize();

        const terrainSprite = getTerrainSprite(
            pixiLoader.resources[SpriteList.TERRAIN].texture,
            0
        );
        terrainSprite.width = tileSizeX;
        terrainSprite.height = tileSizeY;
        this.containerSprite.addChild(terrainSprite);
        return terrainSprite;
    }
}