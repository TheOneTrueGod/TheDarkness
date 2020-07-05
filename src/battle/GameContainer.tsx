import React from 'react';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import { renderBattleMap } from '../battle/BattleMap/Terrain';
import BattleUnit from './BattleUnits/BattleUnit';
import CaravanUnit from './BattleUnits/CaravanUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import UnitManager from './Managers/UnitManager';
import AssetLoader from './Managers/AssetLoader';
import { OWNER_PLAYERS, UnitOwner } from './BattleTypes';
import { getCurrentTurn } from "./BattleHelpers";

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
    currentTurn: UnitOwner;

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

        const caravanUnit = new CaravanUnit(battle.unitIndex ++, OWNER_PLAYERS, battle.caravanPosition);
        this.addBattleUnit(caravanUnit);

        for (let i = 0; i < mission.caravan.unitList.length; i++) {
            const missionUnit = mission.caravan.unitList[i];
            const battleUnit = BattleUnit.fromMissionUnit(
                battle.unitIndex ++,
                missionUnit,
                {
                    x: battle.caravanPosition.x - 1 + i,
                    y: battle.caravanPosition.y + 2,
                }
            );
            this.addBattleUnit(battleUnit);
        }

        this.currentTurn = getCurrentTurn(battle.initiativeNumber, this.unitManager.unitList);
        this.unitManager.updateCurrentTurn(this.currentTurn);
    }

    addBattleUnit(battleUnit: BattleUnit) {
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