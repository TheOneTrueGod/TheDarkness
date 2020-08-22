import React from 'react';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import ClientBattleMap from './BattleMap/ClientBattleMap';
import BattleUnit from './BattleUnits/BattleUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import UnitManager from './Managers/UnitManager';
import OrderManager from './Managers/OrderManager';
import AssetLoader from './Managers/AssetLoader';
import GameDataManager from './Managers/GameDataManager';
import { CurrentTurn } from './BattleTypes';
import { createInitialBattleUnits, getNextTurn, isAITurn } from "./BattleHelpers";
import InteractionHandler from "./Managers/InteractionHandler";
import UnitOrder from './BattleUnits/UnitOrder';
import UnitDetailsBanner from './Components/UnitDetailsBanner';
import BattleHeaderComponent from './BattleHeaderComponent';
import User from '../../object_defs/User';
import AIManager from './Managers/AIManager';
import { DEBUG_MODE } from './BattleConstants';
import BaseAbility from './UnitAbilities/BaseAbility';

const canvasSize = { width: 800, height: 600 };

export type GameContainerProps = {
    battle: Battle,
    mission: Mission,
    user: User,
}

export type GameContainerState = {
    currentTurn: CurrentTurn;
}

class GameContainer extends React.Component<GameContainerProps, GameContainerState> {
    pixiApp: PIXI.Application;
    pixiContainer: HTMLDivElement | null;
    pixiLoader: PIXI.Loader;
    renderContainers: {
        terrain: PIXI.Sprite,
        units: PIXI.Container,
        debug: PIXI.Sprite,
        darkness: PIXI.Sprite,
    };
    gameDataManager: GameDataManager;

    constructor(props: GameContainerProps) {
        super(props);

        this.pixiApp = new PIXI.Application(canvasSize);
        this.pixiApp.renderer.backgroundColor = 0x000000;
        this.pixiLoader = new PIXI.Loader();
        this.pixiContainer = null;
        this.renderContainers = {
            terrain: new PIXI.Sprite(),
            units: new PIXI.Container(),
            debug: new PIXI.Sprite(),
            darkness: new PIXI.Sprite(),
        };
        this.gameDataManager = new GameDataManager(props.battle);

        this.state = {
            currentTurn: {
                team: props.battle.currentTurn.team,
                owner: props.battle.currentTurn.owner,
            }
        };
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
        const { battle, mission, user } = this.props;

        this.pixiApp.stage.addChild(this.renderContainers.terrain);
        this.pixiApp.stage.addChild(this.renderContainers.units);
        this.pixiApp.stage.addChild(this.renderContainers.darkness);
        if (DEBUG_MODE) {
            this.pixiApp.stage.addChild(this.renderContainers.debug);
        }

        this.gameDataManager.clientBattleMap.createTerrain(this.renderContainers.terrain, this.pixiLoader);
        createInitialBattleUnits(battle, mission, this.addBattleUnit);

        this.gameDataManager.interactionHandler.addEventListeners(
            user,
            this.pixiContainer,
            this.setSelectedUnit,
            this.issueUnitOrder,
            this.gameDataManager.clientBattleMap,
        );
        this.gameDataManager.clientBattleMap.updateLightnessLevels(this.renderContainers.darkness, this.gameDataManager.unitManager, user);
        this.startTurn(battle.currentTurn);
    }

    issueUnitOrder = (unitOrder: UnitOrder) => {
        const { user } = this.props;
        this.gameDataManager.orderManager.addUnitOrder(unitOrder);
        this.gameDataManager.orderManager.playNextOrder(
            this.gameDataManager,
            user,
            this.renderContainers.darkness
        );
        this.setState({});
    }

    onEndTurnClick = () => {
        const { currentTurn } = this.state;
        this.endTurn(currentTurn);
    }

    endTurn = (currentTurn: CurrentTurn) => {
        const { battle } = this.props;

        this.onEndTurn(currentTurn);
        
        this.startTurn(
            getNextTurn(
                currentTurn,
                battle.playerIDs
            )
        );
    }

    startTurn(nextTurn: CurrentTurn) {
        const { currentTurn } = this.state;

        if (currentTurn !== nextTurn) {
            this.setState({
                currentTurn: nextTurn
            });

            this.onStartTurn(nextTurn);
            this.gameDataManager.unitManager.cleanupStep(this.gameDataManager.clientBattleMap);
            if (isAITurn(nextTurn)) {
                AIManager.doAIActionsAtTurnStart(this.gameDataManager.unitManager, nextTurn, this.gameDataManager.clientBattleMap, this.issueUnitOrder);
                this.endTurn(nextTurn);
            }
        }
    }

    onStartTurn(nextTurn: CurrentTurn) {
        this.gameDataManager.unitManager.onStartTurn(nextTurn);
        this.gameDataManager.interactionHandler.onStartTurn(nextTurn);
        if (DEBUG_MODE) {
            this.gameDataManager.unitManager.updateUnitDebugSprites(this.pixiLoader, this.renderContainers.debug);
        }
    }

    onEndTurn(currentTurn: CurrentTurn) {
        this.gameDataManager.unitManager.onEndTurn(currentTurn);
    }

    setSelectedUnit = (selectedUnit: BattleUnit) => {
        this.gameDataManager.setSelectedUnit(selectedUnit);
        this.setState({});
    }

    setSelectedAbility = (ability: BaseAbility) => {
        this.gameDataManager.setSelectedAbility(ability);
        this.setState({});
    }

    addBattleUnit = (battleUnit: BattleUnit) => {
        this.gameDataManager.unitManager.addBattleUnit(battleUnit, this.gameDataManager.clientBattleMap);
        this.renderContainers.units.addChild(battleUnit.getSprite(this.pixiLoader));
    }

    render() {
        const { user } = this.props;
        const { currentTurn } = this.state;
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
                <UnitDetailsBanner 
                    selectedUnit={this.gameDataManager.selectedUnit}
                    selectedAbility={this.gameDataManager.selectedAbility}
                    user={user}
                    onAbilityClick={(unit: BattleUnit, ability: BaseAbility) => {
                        this.gameDataManager.interactionHandler.handleAbilityClick(ability, this.setSelectedAbility);
                    }}
                />
            </div>
        )
    }
}

export default GameContainer;