import BaseAnimation from "./Animations/BaseAnimation";
export default class AnimationManager {
    animations: Array<BaseAnimation> = [];
    constructor() {
        
    }

    addAnimation(animation: BaseAnimation) {
        this.animations.push(animation);
        return animation;
    }

    playAnimations() {
        let i = 0;
        while (i < this.animations.length) {
            this.animations[i].playAnimation();
            if (this.animations[i].isDone()) {
                this.animations.splice(i, 1);
            } else {
                i ++;
            }
        }
    }
}