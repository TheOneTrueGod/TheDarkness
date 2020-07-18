import BattleUnit from "./BattleUnit";
import { SpriteList } from "../SpriteUtils";
import { TileCoord, UnitOwner } from "../BattleTypes";

export default class CaravanUnit extends BattleUnit {
    constructor(id: number, owner: UnitOwner, position: TileCoord) {
        super(id, owner, position);
    }

    getAbilityPoints() {
        return {
            action: {
                used: 0,
                available: 0,
            },
            movement: {
                used: 0,
                available: 0,
            }
        }
    }

    getSpriteTexture(pixiLoader: PIXI.Loader): PIXI.Texture {
        return pixiLoader.resources[SpriteList.CARAVAN].texture;
    }

    getUnitSize(): TileCoord {
        return { x: 2, y: 2 };
    }
}