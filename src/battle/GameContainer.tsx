import * as PIXI from 'pixi.js';
import React from 'react';

export type GameContainerProps = {
}

export type GameContainerState = {
}

class GameContainer extends React.Component<GameContainerProps, GameContainerState> {
    pixiApp: PIXI.Application;
    pixiContainer: HTMLDivElement | null;
    pixiLoader: PIXI.Loader;
    constructor(props: GameContainerProps) {
        super(props);

        this.pixiApp = new PIXI.Application({width: 800, height: 600});
        this.pixiApp.renderer.backgroundColor = 0xFF0000;
        this.pixiLoader = new PIXI.Loader();
        this.pixiContainer = null;
    }
    componentDidMount() {
        PIXI.utils.sayHello("WebGL");
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
        this.pixiLoader.add("broadsword", '/assets/broadsword.png')
            .load(this.initialize);
     };

     initialize = () => {
        const avatar = new PIXI.Sprite(this.pixiLoader.resources["broadsword"].texture);
        this.pixiApp.stage.addChild(avatar);
     }
     

    render() {
        return (
            <div ref={this.updatePixiContainer} />
        )
    }
}

export default GameContainer;