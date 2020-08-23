import BaseAnimation from "./Animations/BaseAnimation";
export default class AnimationManager {
    animations: Array<BaseAnimation> = [];
    effectContainer: PIXI.Sprite;
    pixiLoader: PIXI.Loader;
    constructor(effectContainer: PIXI.Sprite, pixiLoader: PIXI.Loader) {
        this.effectContainer = effectContainer;
        this.pixiLoader = pixiLoader;
    }

    addAnimation(animation: BaseAnimation) {
        this.animations.push(animation);
        if (animation.hasSprite()) {
            animation.createSprite(this.pixiLoader);
            animation.addSprites(this.effectContainer);
        }
        return animation;
    }

    playAnimations() {
        let i = 0;
        while (i < this.animations.length) {
            this.animations[i].playAnimation();
            if (this.animations[i].isDone()) {
                if (this.animations[i].hasSprite()) {
                    this.animations[i].removeSprites();
                }
                this.animations.splice(i, 1);
            } else {
                i ++;
            }
        }
    }
}