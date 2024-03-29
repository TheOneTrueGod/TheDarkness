import { SpriteList } from "../SpriteUtils";

export default class AssetLoader {
  static preLoad(pixiLoader: PIXI.Loader, loadComplete: Function) {
    pixiLoader
      // icons
      .add(SpriteList.CROSSHAIR, "/assets/crosshair.png")
      .add(SpriteList.CIRCLE, "/assets/plain-circle.png")
      .add(SpriteList.POSITION_MARKER, "/assets/position-marker.png")
      // players
      .add(SpriteList.BROADSWORD, "/assets/broadsword.png")
      .add(SpriteList.CROSSBOW, "/assets/crossbow.png")
      .add(SpriteList.CARAVAN, "/assets/old-wagon.png")
      // enemies
      .add(SpriteList.ENEMY_WOLF, "/assets/wolf-head.png")
      // terrain
      .add(SpriteList.TERRAIN, "/assets/terrain.png")
      .add(SpriteList.TILESET, "/assets/kenny_tileset/Tilesheet/colored.png")
      // abilities
      .add(SpriteList.ABILITY_BLUE_EXPLOSION, "/assets/blue-explosion.png")
      .add(SpriteList.ABILITY_SWORD_SLASH, "/assets/sword-slash.png");

    pixiLoader.onComplete.add(() => {
      loadComplete();
    });

    pixiLoader.load();
  }
}
