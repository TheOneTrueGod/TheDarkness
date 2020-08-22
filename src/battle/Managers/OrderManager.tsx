import UnitOrder from "../BattleUnits/UnitOrder";
import UnitManager from "./UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import User from "../../../object_defs/User";
import GameDataManager from "./GameDataManager";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;

    constructor() {}

    addUnitOrder(unitOrder: UnitOrder) {
        this.orderList.push(unitOrder);
    }

    playNextOrder(gameDataManager: GameDataManager, user: User, darknessContainer: PIXI.Sprite) {
        const order = this.orderList[this.orderOn];
        order.playOutOrder(gameDataManager);
        this.orderOn += 1;
        gameDataManager.clientBattleMap.updateLightnessLevels(darknessContainer, gameDataManager.unitManager, user);
        gameDataManager.unitManager.cleanupStep(gameDataManager.clientBattleMap);
    }
}