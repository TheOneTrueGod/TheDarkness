import MissionUnit from "../../../object_defs/Campaign/Mission/MissionUnit.js";
import { SpriteList } from "../SpriteUtils";
import { TileCoord } from "../BattleTypes";
import BattleConstants from "../BattleConstants";

export default class BattleUnit {
    sprite: PIXI.Sprite | null;
    position: TileCoord;

    constructor(position: TileCoord) {
        this.sprite = null;
        this.position = { x: position.x, y: position.y };
    }

    static fromMissionUnit(missionUnit: MissionUnit, position: TileCoord) {
        return new BattleUnit(position);
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
        this.sprite.width = tileSize.x * unitSize.x;
        this.sprite.height = tileSize.y * unitSize.y;

        return this.sprite;
    }
};