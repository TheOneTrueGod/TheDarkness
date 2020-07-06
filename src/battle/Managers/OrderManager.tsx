import UnitOrder from "../BattleUnits/UnitOrder";
import UnitManager from "./UnitManager";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;

    constructor() {}

    addUnitOrder(unitOrder: UnitOrder) {
        this.orderList.push(unitOrder);
    }

    playNextOrder(unitManager: UnitManager) {
        const order = this.orderList[this.orderOn];
        order.playOutOrder(unitManager);
        this.orderOn += 1;
    }
}