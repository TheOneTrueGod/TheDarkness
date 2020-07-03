import * as PIXI from 'pixi.js';
import React from 'react';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import { renderBattleMap } from '../battle/BattleMap/Terrain';
import { SpriteList } from './SpriteUtils';

export type GameContainerProps = {
    battle: Battle,
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
    constructor(props: GameContainerProps) {
        super(props);

        this.pixiApp = new PIXI.Application({ width: 800, height: 600 });
        this.pixiApp.renderer.backgroundColor = 0x000000;
        this.pixiLoader = new PIXI.Loader();
        this.pixiContainer = null;
        this.renderContainers = {
            terrain: new PIXI.Sprite(),
            units: new PIXI.Container(),
        }
    }

    // Step 1 -- container mounted
    updatePixiContainer = (element: HTMLDivElement) => {
        this.pixiContainer = element;
        if(this.pixiContainer && this.pixiContainer.children.length<=0) {
            this.pixiContainer.appendChild(this.pixiApp.view);
            this.preLoad();
        }
    }
    // Step 2 -- load assets
    preLoad = () => {
        this.pixiLoader.add(SpriteList.BROADSWORD, '/assets/broadsword.png')
        this.pixiLoader.add(SpriteList.TERRAIN, '/assets/terrain.png')
            .load(this.initialize);
     };

     // Step 3 -- initialize the stage
    initialize = () => {
        const { battle } = this.props;

        const avatar = new PIXI.Sprite(this.pixiLoader.resources["broadsword"].texture);

        this.pixiApp.stage.addChild(this.renderContainers.terrain);
        this.pixiApp.stage.addChild(this.renderContainers.units);

        this.renderContainers.units.addChild(avatar);

        renderBattleMap(battle.battleMap, this.renderContainers.terrain, this.pixiLoader);
    }

    render() {
        return (
            <div ref={this.updatePixiContainer} />
        )
    }
}

export default GameContainer;