import React from 'react';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import { renderBattleMap } from '../battle/BattleMap/Terrain';
import BattleUnit from './BattleUnits/BattleUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import UnitManager from './Managers/UnitManager';
import OrderManager from './Managers/OrderManager';
import AssetLoader from './Managers/AssetLoader';
import { UnitOwner, CurrentTurn } from './BattleTypes';
import { getTurnForInitiativeNumber, createInitialBattleUnits } from "./BattleHelpers";
import InteractionHandler from "./Managers/InteractionHandler";
import UnitOrder from './BattleUnits/UnitOrder';
import UnitDetailsBanner from './UnitDetailsBanner';
import BattleHeaderComponent from './BattleHeaderComponent';
import User from '../../object_defs/User';

const canvasSize = { width: 800, height: 600 };

export type GameContainerProps = {
    battle: Battle,
    mission: Mission,
    user: User,
}

export type GameContainerState = {
    selectedUnit: BattleUnit | null;
    currentTurn: CurrentTurn;
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

    constructor(props: GameContainerProps) {
        super(props);

        this.pixiApp = new PIXI.Application(canvasSize);
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

        this.state = {
            selectedUnit: null,
            currentTurn: {
                team: props.battle.currentTurn.team,
                owner: props.battle.currentTurn.owner,
            }
        };
    }

    // Step 1 -- container mounted
    updatePixiContainer = (element: HTMLDivElement) => {
        console.log("Updating reference");
        this.pixiContainer = element;
        if(this.pixiContainer && this.pixiContainer.children.length<=0) {
            this.pixiContainer.appendChild(this.pixiApp.view);
            AssetLoader.preLoad(this.pixiLoader, this.initialize);
        }
    }

     // Step 2 -- initialize the stage
    initialize = () => {
        const { battle, mission, user } = this.props;

        this.pixiApp.stage.addChild(this.renderContainers.terrain);
        this.pixiApp.stage.addChild(this.renderContainers.units);

        renderBattleMap(battle.battleMap, this.renderContainers.terrain, this.pixiLoader);
        createInitialBattleUnits(battle, mission, this.addBattleUnit);

        this.interactionHandler.addEventListeners(
            user,
            this.pixiContainer,
            this.updateSelectedUnit,
            this.issueUnitOrder,
            battle.battleMap,
        );
        this.startNextTurn();
    }

    issueUnitOrder = (unitOrder: UnitOrder) => {
        const { battle } = this.props;
        this.orderManager.addUnitOrder(unitOrder);
        this.orderManager.playNextOrder(battle.battleMap, this.unitManager);
        this.setState({
            selectedUnit: this.state.selectedUnit
        });
    }

    onEndTurnClick() {
        this.startNextTurn()
    }

    startNextTurn() {
        const { currentTurn } = this.state;
        const { battle } = this.props;

        const nextTurn = getTurnForInitiativeNumber(
            battle.initiativeNumber,
            this.unitManager.unitList
        );

        this.setState({
            currentTurn: nextTurn
        });

        this.updateCurrentTurn();
    }

    updateCurrentTurn() {
        const { currentTurn } = this.state;

        this.unitManager.updateCurrentTurn(currentTurn);
        this.interactionHandler.updateCurrentTurn(currentTurn);
    }

    updateSelectedUnit = (selectedUnit: BattleUnit) => {
        const { selectedUnit: previousUnit } = this.state;
        previousUnit && previousUnit.setSelected(false);
        selectedUnit.setSelected(true);
        this.setState({ selectedUnit });
    }

    addBattleUnit = (battleUnit: BattleUnit) => {
        this.unitManager.addBattleUnit(battleUnit);
        this.renderContainers.units.addChild(battleUnit.getSprite(this.pixiLoader));
    }

    render() {
        const { user } = this.props;
        const { selectedUnit, currentTurn } = this.state;
        return (
            <div style={{
                width: canvasSize.width,
                height: canvasSize.height,
                position: 'absolute',
                overflow: 'hidden',
            }}>
                <BattleHeaderComponent
                    user={user}
                    currentTurn={currentTurn}
                    onEndTurnClick={this.onEndTurnClick}
                />
                <div ref={this.updatePixiContainer} />
                <UnitDetailsBanner selectedUnit={selectedUnit} />
            </div>
        )
    }
}

export default GameContainer;