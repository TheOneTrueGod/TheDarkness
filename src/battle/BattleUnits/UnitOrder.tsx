import { TileCoord } from "../BattleTypes";
import BattleUnit from "./BattleUnit";
import UnitManager from "../Managers/UnitManager";

export enum OrderType {
    MOVE,
    USE_ABILITY,
    ENTER,
}

export default class UnitOrder {
    orderType: OrderType;
    target: TileCoord;
    unit: BattleUnit;

    constructor(unit: BattleUnit, orderType: OrderType, target: TileCoord) {
        this.unit = unit;
        this.orderType = orderType;
        this.target = target;
    }

    playOutOrder(unitManager: UnitManager) {
        if (this.orderType === OrderType.MOVE) {
            unitManager.moveUnit(this.unit, this.target);
        }
    }
}