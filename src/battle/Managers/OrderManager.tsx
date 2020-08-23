import UnitOrder from "../BattleUnits/UnitOrder";
import User from "../../../object_defs/User";
import GameDataManager from "./GameDataManager";

export default class OrderManager {
    orderList: Array<UnitOrder> = [];
    orderOn: number = 0;
    playingOrder: boolean;
    allDoneCallbacks: Array<Function> = [];
    gameDataManager: GameDataManager;
    user: User;
    darknessContainer: PIXI.Sprite;

    constructor(
        gameDataManager: GameDataManager,
        user: User,
        darknessContainer: PIXI.Sprite,
    ) {
        this.gameDataManager = gameDataManager;
        this.user = user;
        this.darknessContainer = darknessContainer;
    }

    addUnitOrder(unitOrder: UnitOrder) {
        unitOrder.spendResources();
        this.orderList.push(unitOrder);
    }

    playNextOrder(
        allOrdersDoneCallback: Function | null = null
    ) {
        allOrdersDoneCallback && this.allDoneCallbacks.push(allOrdersDoneCallback);
        if (this.playingOrder) { return; }
        if (this.orderOn >= this.orderList.length) {
            const callbacksToCall = this.allDoneCallbacks;
            this.allDoneCallbacks = [];
            callbacksToCall.forEach(callback => callback());
            return;
        }

        this.playingOrder = true;
        const order = this.orderList[this.orderOn];

        this.orderOn += 1;
        
        order.playOutOrder(this.gameDataManager, () => {
            this.gameDataManager.clientBattleMap.updateLightnessLevels(
                this.darknessContainer,
                this.gameDataManager.unitManager,
                this.user
            );
            this.gameDataManager.unitManager.cleanupStep(this.gameDataManager.clientBattleMap);
            this.playingOrder = false;
            this.playNextOrder();
        });
    }
}