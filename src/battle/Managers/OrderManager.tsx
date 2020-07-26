import UnitOrder from "../BattleUnits/UnitOrder";
import UnitManager from "./UnitManager";
import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;

    constructor() {}

    addUnitOrder(unitOrder: UnitOrder) {
        this.orderList.push(unitOrder);
    }

    playNextOrder(battleMap: BattleMap, unitManager: UnitManager) {
        const order = this.orderList[this.orderOn];
        order.playOutOrder(battleMap, unitManager);
        this.orderOn += 1;
        unitManager.cleanupStep();
    }
}