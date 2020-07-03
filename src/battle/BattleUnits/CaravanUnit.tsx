import BattleUnit from "./BattleUnit";
import { SpriteList } from "../SpriteUtils";
import { TileCoord } from "../BattleTypes";

export default class CaravanUnit extends BattleUnit {
    constructor(position: TileCoord) {
        super(position);
    }

    getSpriteTexture(pixiLoader: PIXI.Loader): PIXI.Texture {
        return pixiLoader.resources[SpriteList.CARAVAN].texture;
    }

    getUnitSize(): TileCoord {
        return { x: 2, y: 2 };
    }
}