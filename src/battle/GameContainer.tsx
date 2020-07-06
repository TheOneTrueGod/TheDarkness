import React from 'react';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import { renderBattleMap } from '../battle/BattleMap/Terrain';
import BattleUnit from './BattleUnits/BattleUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import UnitManager from './Managers/UnitManager';
import OrderManager from './Managers/OrderManager';
import AssetLoader from './Managers/AssetLoader';
import { UnitOwner } from './BattleTypes';
import { getCurrentTurn, createInitialBattleUnits } from "./BattleHelpers";
import InteractionHandler from "./Managers/InteractionHandler";
import UnitOrder from './BattleUnits/UnitOrder';

export type GameContainerProps = {
    battle: Battle,
    mission: Mission,
}

export type GameContainerState = {
}

class GameContainer extends React.Component<GameContainerProps, GameContainerState> {
    pixiApp: PIXI.Application;
    pixiContainer: HTMLDivElement | null;
    pixiLoader: PIXI.Loader;
    renderContainers: {
        terrain: PIXI.Sprite,
        units: PIXI.Container,
    };
    unitManager: UnitManager;
    interactionHandler: InteractionHandler;
    orderManager: OrderManager;
    currentTurn: UnitOwner;
    selectedUnit: BattleUnit;

    constructor(props: GameContainerProps) {
        super(props);

        this.pixiApp = new PIXI.Application({ width: 800, height: 600 });
        this.pixiApp.renderer.backgroundColor = 0x000000;
        this.pixiLoader = new PIXI.Loader();
        this.pixiContainer = null;
        this.renderContainers = {
            terrain: new PIXI.Sprite(),
            units: new PIXI.Container(),
        };
        this.unitManager = new UnitManager();
        this.orderManager = new OrderManager();
        this.interactionHandler = new InteractionHandler(this.unitManager);
        this.currentTurn = null;
    }

    // Step 1 -- container mounted
    updatePixiContainer = (element: HTMLDivElement) => {
        this.pixiContainer = element;
        if(this.pixiContainer && this.pixiContainer.children.length<=0) {
            this.pixiContainer.appendChild(this.pixiApp.view);
            AssetLoader.preLoad(this.pixiLoader, this.initialize);
        }
    }

     // Step 2 -- initialize the stage
    initialize = () => {
        const { battle, mission } = this.props;

        this.pixiApp.stage.addChild(this.renderContainers.terrain);
        this.pixiApp.stage.addChild(this.renderContainers.units);

        renderBattleMap(battle.battleMap, this.renderContainers.terrain, this.pixiLoader);
        createInitialBattleUnits(battle, mission, this.addBattleUnit);

        this.interactionHandler.addEventListeners(
            this.pixiContainer,
            this.updateSelectedUnit,
            this.issueUnitOrder,
        );
        this.updateCurrentTurn();
    }

    issueUnitOrder = (unitOrder: UnitOrder) => {
        this.orderManager.addUnitOrder(unitOrder);
        this.orderManager.playNextOrder(this.unitManager);
    }

    updateCurrentTurn() {
        const previousTurn = this.currentTurn;
        const { battle } = this.props;
        this.currentTurn = getCurrentTurn(battle.initiativeNumber, this.unitManager.unitList);
        if (previousTurn !== this.currentTurn) {
            this.unitManager.updateCurrentTurn(this.currentTurn);
        }
    }

    updateSelectedUnit = (selectedUnit: BattleUnit) => {
        this.selectedUnit && this.selectedUnit.setSelected(false);
        this.selectedUnit = selectedUnit;
        this.selectedUnit.setSelected(true);
    }

    addBattleUnit = (battleUnit: BattleUnit) => {
        this.unitManager.addBattleUnit(battleUnit);
        this.renderContainers.units.addChild(battleUnit.getSprite(this.pixiLoader));
    }

    render() {
        return (
            <div ref={this.updatePixiContainer} />
        )
    }
}

export default GameContainer;