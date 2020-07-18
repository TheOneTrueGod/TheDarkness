import { SpriteList } from "../SpriteUtils";

export default class AssetLoader {
    static preLoad(pixiLoader: PIXI.Loader, loadComplete: Function) {
        pixiLoader
            .add(SpriteList.BROADSWORD, '/assets/broadsword.png')
            .add(SpriteList.CARAVAN, '/assets/old-wagon.png')
            // enemies
            .add(SpriteList.ENEMY_WOLF, '/assets/wolf-head.png')
            // terrain
            .add(SpriteList.TERRAIN, '/assets/terrain.png');

        pixiLoader.onComplete.add(() => { 
            loadComplete()
        });
        
        pixiLoader.load();
    }
}