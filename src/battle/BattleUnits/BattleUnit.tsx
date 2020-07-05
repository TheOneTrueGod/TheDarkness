import MissionUnit from "../../../object_defs/Campaign/Mission/MissionUnit.js";
import { SpriteList } from "../SpriteUtils";
import { TileCoord, UnitOwner } from "../BattleTypes";
import BattleConstants from "../BattleConstants";

interface SpriteDecorations {
    readyForAction: PIXI.Sprite | null
};

export default class BattleUnit {
    sprite: PIXI.Sprite | null = null;
    position: TileCoord;
    id: number;
    initiativeNumber: number;
    owner: UnitOwner;
    spriteDecorations: SpriteDecorations;

    constructor(id: number, owner: UnitOwner, position: TileCoord) {
        this.position = { x: position.x, y: position.y };
        this.id = id;
        this.initiativeNumber = 0;
        this.owner = owner;
        this.spriteDecorations = {
            readyForAction: null
        };
    }

    static fromMissionUnit(id: number, missionUnit: MissionUnit, position: TileCoord) {
        return new BattleUnit(id, missionUnit.ownerId, position);
    }

    getSpriteTexture(pixiLoader: PIXI.Loader): PIXI.Texture {
        return pixiLoader.resources[SpriteList.BROADSWORD].texture;
    }

    getUnitSize(): TileCoord {
        return { x: 1, y: 1 };
    }

    getSprite(pixiLoader: PIXI.Loader) {
        if (this.sprite) { return this.sprite; }

        const spriteTexture = this.getSpriteTexture(pixiLoader);

        this.sprite = new PIXI.Sprite(spriteTexture);
        const tileSize = BattleConstants.getTileSize();
        
        this.sprite.position.x = this.position.x * tileSize.x;
        this.sprite.position.y = this.position.y * tileSize.y;

        const unitSize = this.getUnitSize();
        
        this.createSpriteDecorations(this.sprite);

        this.sprite.width = tileSize.x * unitSize.x;
        this.sprite.height = tileSize.y * unitSize.y;

        return this.sprite;
    }

    createSpriteDecorations(sprite: PIXI.Sprite) {
        this.spriteDecorations.readyForAction = this.createReadyForActionSprite(sprite.width, sprite.height);
        sprite.addChild(this.spriteDecorations.readyForAction);
    }

    createReadyForActionSprite(width: number, height: number): PIXI.Sprite {
        const RFASprite = new PIXI.Sprite();
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x00FF00);
        graphics.drawRect(0, 0, width, height);
        RFASprite.addChild(graphics);
        RFASprite.visible = false;
        return RFASprite;
    }

    setShowReadyForAction(ready: boolean) {
        this.spriteDecorations.readyForAction.visible = ready;
    }
};