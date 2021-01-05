import UnitManager from "./UnitManager";
import InteractionHandler from "./InteractionHandler";
import OrderManager from "./OrderManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import Battle from "../../../object_defs/Campaign/Mission/Battle/Battle";
import AnimationManager from "./AnimationManager";
import BattleUnit from "../BattleUnits/BattleUnit";
import BaseAbility from "../UnitAbilities/BaseAbility";
import User from "../../../object_defs/User";

export default class GameDataManager {
    unitManager: UnitManager;
    interactionHandler: InteractionHandler;
    orderManager: OrderManager;
    clientBattleMap: ClientBattleMap;
    animationManager: AnimationManager

    selectedUnit: BattleUnit | null;
    selectedAbility: BaseAbility | null;
    constructor(battle: Battle, user: User, pixiLoader: PIXI.Loader, darknessContainer: PIXI.Sprite, effectsContainer: PIXI.Container) {
        this.unitManager = new UnitManager();
        this.orderManager = new OrderManager(this, user, darknessContainer);
        this.interactionHandler = new InteractionHandler(this.unitManager);
        this.clientBattleMap = new ClientBattleMap(battle.battleMap);
        this.animationManager = new AnimationManager(effectsContainer, pixiLoader);

        this.selectedUnit = null;
    }

    setSelectedUnit = (selectedUnit: BattleUnit) => {
        const previousUnit = this.selectedUnit;
        previousUnit && previousUnit.setSelected(false);
        selectedUnit.setSelected(true);

        this.selectedUnit = selectedUnit;
        this.setSelectedAbility(null);
        this.interactionHandler.selectedUnit = selectedUnit;
    }

    setSelectedAbility = (ability: BaseAbility) => {
        this.selectedAbility = ability;
        this.interactionHandler.setSelectedAbility(ability);
        this.refreshAbilitySelectedState();
    }

    refreshAbilitySelectedState() {
        this.clientBattleMap.showAbilitySelectedState(this.selectedAbility, this.selectedUnit, this.interactionHandler.abilityTargets.length, this);
    }

    tickerTick(delta: number): void {
        this.animationManager.playAnimations();
    }
}