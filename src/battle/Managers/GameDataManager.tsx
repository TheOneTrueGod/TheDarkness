import UnitManager from "./UnitManager";
import InteractionHandler from "./InteractionHandler";
import OrderManager from "./OrderManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import Battle from "../../../object_defs/Campaign/Mission/Battle/Battle";

export default class GameDataManager {
    unitManager: UnitManager;
    interactionHandler: InteractionHandler;
    orderManager: OrderManager;
    clientBattleMap: ClientBattleMap;
    constructor(battle: Battle) {
        this.unitManager = new UnitManager();
        this.orderManager = new OrderManager();
        this.interactionHandler = new InteractionHandler(this.unitManager);
        this.clientBattleMap = new ClientBattleMap(battle.battleMap);
    }
}