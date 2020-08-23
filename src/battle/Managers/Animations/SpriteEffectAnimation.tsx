import BaseAnimation from "./BaseAnimation";
import { TileCoord, GamePosition } from "../../BattleTypes";
import { lerp, positionToTileCoord } from "../../BattleHelpers";
import { SpriteList } from "../../SpriteUtils";
import { getTileSize } from "../../BattleConstants";

type SpriteEffectDef = {
    sprite: SpriteList,
    xTiles: number,
    yTiles: number,
};
export enum SpriteEffectNames { BlueExplosion = 'BlueExplosion', }
export const SpriteEffects: Record<SpriteEffectNames, SpriteEffectDef> = {
    [SpriteEffectNames.BlueExplosion]: {
        sprite: SpriteList.ABILITY_BLUE_EXPLOSION,
        xTiles: 3, yTiles: 3,
    }
};

export default class SpriteEffectAnimation extends BaseAnimation {
    tileCoord: TileCoord;
    duration: number;
    spriteEffectDef: SpriteEffectDef;
    tickOn: number = 0;
    startFrame: number = 0;
    endFrame: number = 0;
    visibleSprite: number = 0;
    size: GamePosition;

    effectSprites: Array<PIXI.Sprite> = [];
    mainSprite: PIXI.Sprite;

    constructor(spriteEffectDef: SpriteEffectDef, tileCoord: TileCoord, duration: number, startFrame: number, endFrame: number = 0) {
        super();
        this.tileCoord = tileCoord;
        this.duration = duration;
        this.spriteEffectDef = spriteEffectDef;
        this.startFrame = startFrame;
        this.endFrame = endFrame ? endFrame : this.spriteEffectDef.xTiles * this.spriteEffectDef.yTiles;

        this.size = getTileSize();
    }

    initializeEffectSprites(pixiLoader: PIXI.Loader): void {
        const resourceTexture = pixiLoader.resources[this.spriteEffectDef.sprite].texture;
        const resourceSize = { 
            x: resourceTexture.width,
            y: resourceTexture.height,
        };
        const imageSize = { 
            x: Math.floor(resourceSize.x / this.spriteEffectDef.xTiles),
            y: Math.floor(resourceSize.y / this.spriteEffectDef.yTiles),
        };

        const effectTextures = [];

        for (let x = 0; x < this.spriteEffectDef.xTiles; x++) {
            for (let y = 0; y < this.spriteEffectDef.yTiles; y++) {
                const tileFramePosition = { x, y };
                const t32Rect = new PIXI.Rectangle(
                    imageSize.x * tileFramePosition.x,
                    imageSize.y * tileFramePosition.y,
                    imageSize.x,
                    imageSize.y
                );
                
                const framedTexture = new PIXI.Texture(resourceTexture.baseTexture, t32Rect);
                effectTextures.push(framedTexture);
            }
        }

        effectTextures.forEach(texture => {
            const effectSprite = new PIXI.Sprite(texture);
            effectSprite.width = this.size.x;
            effectSprite.height = this.size.y;
            this.effectSprites.push(effectSprite);
        })
    }

    createSprite(pixiLoader: PIXI.Loader) {
        this.initializeEffectSprites(pixiLoader);
        
        this.mainSprite = new PIXI.Sprite();
        this.effectSprites.forEach((sprite) => {
            sprite.visible = false;
            this.mainSprite.addChild(sprite);
        });

        this.mainSprite.width = this.size.x;
        this.mainSprite.height = this.size.y;

        const position = positionToTileCoord(this.tileCoord);
        this.mainSprite.position.x = position.x;
        this.mainSprite.position.y = position.y;
    }

    playAnimation() {
        this.effectSprites[this.visibleSprite].visible = false;
        this.tickOn += 1;
        const pctDone = Math.min(this.tickOn / this.duration, 0.99999);
        const frameOn = Math.floor(lerp(this.startFrame, this.endFrame, pctDone));
        this.effectSprites[frameOn].visible = true;
        this.visibleSprite = frameOn;
        if (this.isDone()) {
            this.callListeners(BaseAnimation.ANIMATION_EVENT_DONE);
        }
    }

    isDone() {
        return this.tickOn >= this.duration;
    }

    hasSprite() {
        return true;
    }

    addSprites(effectContainer: PIXI.Sprite) {
        effectContainer.addChild(this.mainSprite);
    }

    removeSprites() {
        this.mainSprite.parent.removeChild(this.mainSprite);
    }
}