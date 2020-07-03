import BattleUnit from "../BattleUnits/BattleUnit";

export default class UnitManager {
    unitList: Array<BattleUnit>;

    constructor() {
        this.unitList = [];
    }

    addBattleUnit(battleUnit: BattleUnit) {
        this.unitList.push(battleUnit);
    }

}