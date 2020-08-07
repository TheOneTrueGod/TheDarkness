import UnitOrder from "../BattleUnits/UnitOrder";
import UnitManager from "./UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;

    constructor() {}

    addUnitOrder(unitOrder: UnitOrder) {
        this.orderList.push(unitOrder);
    }

    playNextOrder(clientBattleMap: ClientBattleMap, unitManager: UnitManager) {
        const order = this.orderList[this.orderOn];
        order.playOutOrder(clientBattleMap, unitManager);
        this.orderOn += 1;
        unitManager.cleanupStep();
    }
}