import BattleUnit, { AbilityPointType } from "./BattleUnit";
import UnitManager from "../Managers/UnitManager";
import BaseAbility, { AbilityTarget } from "../UnitAbilities/BaseAbility";
import GameDataManager from "../Managers/GameDataManager";

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

    playOutOrder(gameDataManager: GameDataManager, doneCallback: Function) {
        if (this.orderType === OrderType.USE_ABILITY) {
            if (!this.ability) {
                throw new Error("Can't play out an order with no ability");
            }
            this.ability.playOutAbility(gameDataManager, this.unit, this.targets, doneCallback);
        }
    }

    spendResources() {
        if (!this.ability) { return; }
        this.ability.spendResources(this.unit);
    }
}