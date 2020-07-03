import MissionUnit from "../../../object_defs/Campaign/Mission/MissionUnit.js";
import { SpriteList } from "../SpriteUtils";
import { TileCoord } from "../BattleTypes";
import BattleConstants from "../BattleConstants";

export default class BattleUnit {
    sprite: PIXI.Sprite | null;
    position: TileCoord;

    constructor(tempIndex: number) {
        this.sprite = null;
        this.position = { x: 2 + tempIndex * 2, y: 2 };
    }

    static fromMissionUnit(missionUnit: MissionUnit, tempIndex: number) {
        return new BattleUnit(tempIndex);
    }

    getSprite(pixiLoader: PIXI.Loader) {
        if (this.sprite) { return this.sprite; }

        const spriteTexture = pixiLoader.resources[SpriteList.BROADSWORD].texture;

        this.sprite = new PIXI.Sprite(spriteTexture);
        const tileSize = BattleConstants.getTileSize();
        
        this.sprite.position.x = this.position.x * tileSize.x;
        this.sprite.position.y = this.position.y * tileSize.y;

        this.sprite.width = tileSize.x;
        this.sprite.height = tileSize.y;

        return this.sprite;
    }
};