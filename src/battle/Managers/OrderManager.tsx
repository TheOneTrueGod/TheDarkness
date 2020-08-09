import UnitOrder from "../BattleUnits/UnitOrder";
import UnitManager from "./UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import User from "../../../object_defs/User";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;

    constructor() {}

    addUnitOrder(unitOrder: UnitOrder) {
        this.orderList.push(unitOrder);
    }

    playNextOrder(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: User, darknessContainer: PIXI.Sprite) {
        const order = this.orderList[this.orderOn];
        order.playOutOrder(clientBattleMap, unitManager);
        this.orderOn += 1;
        clientBattleMap.updateLightnessLevels(darknessContainer, unitManager, user);
        unitManager.cleanupStep(clientBattleMap);
    }
}