import BattleUnit from "../BattleUnits/BattleUnit";
import { UnitOwner } from "../BattleTypes";

export default class UnitManager {
    unitList: Array<BattleUnit>;

    constructor() {
        this.unitList = [];
    }

    addBattleUnit(battleUnit: BattleUnit) {
        this.unitList.push(battleUnit);
    }

    updateCurrentTurn(currentTurn: UnitOwner) {
        this.unitList.forEach((unit) => {
            // TODO: This needs to include things like 'does the unit have any actions left'
            unit.setShowReadyForAction(currentTurn === unit.owner);
        });
    }

}