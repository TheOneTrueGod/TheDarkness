import BattleUnit, { AbilityPointType } from "./BattleUnit";
import UnitManager from "../Managers/UnitManager";
import BaseAbility, { AbilityTarget } from "../UnitAbilities/BaseAbility";
import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";

export enum OrderType {
    USE_ABILITY,
    ENTER,
}

export default class UnitOrder {
    orderType: OrderType;
    ability?: BaseAbility;
    targets: Array<AbilityTarget>;
    unit: BattleUnit;

    constructor(unit: BattleUnit, orderType: OrderType, targets: Array<AbilityTarget>, ability?: BaseAbility) {
        this.unit = unit;
        this.orderType = orderType;
        this.targets = targets;
        this.ability = ability;
    }

    playOutOrder(battleMap: BattleMap, unitManager: UnitManager) {
        if (this.orderType === OrderType.USE_ABILITY) {
            if (!this.ability) {
                throw new Error("Can't play out an order with no ability");
            }
            this.ability.playOutAbility(battleMap, unitManager, this.unit, this.targets);
        }
    }
}