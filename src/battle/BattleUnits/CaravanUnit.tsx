import BattleUnit from "./BattleUnit";
import { TileCoord, UnitOwner } from "../BattleTypes";
import { CaravanUnitDef } from "./UnitDef";

export default class CaravanUnit extends BattleUnit {
    constructor(id: number, owner: UnitOwner, position: TileCoord) {
        super(CaravanUnitDef, id, owner, 'allies', position);
    }

    isTargetable() {
        return false;
    }

    canAct() {
        return false;
    }

    // Lightness Related Stats
    getLightLevel() {
        return 7;
    }
}