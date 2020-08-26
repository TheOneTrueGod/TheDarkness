
export type AnimationCallbackFunction = () => void;

export enum AnimationEventTypes {
    ANIMATION_EVENT_DONE = 'ANIMATION_EVENT_DONE',
    ANIMATION_EVENT_HALF_DONE = 'ANIMATION_EVENT_HALF_DONE',
    FIRST_PART_DONE = 'FIRST_PART_DONE',
}

export default class BaseAnimation {
    public static readonly ANIMATION_EVENT_DONE = AnimationEventTypes.ANIMATION_EVENT_DONE;
    public static readonly ANIMATION_EVENT_HALF_DONE = AnimationEventTypes.ANIMATION_EVENT_HALF_DONE;

    listeners: Record<AnimationEventTypes, Array<AnimationCallbackFunction>>;
    constructor() {
        // @ts-ignore
        this.listeners = {};
    }

    playAnimation() {
        this.callListeners(BaseAnimation.ANIMATION_EVENT_HALF_DONE);
        this.callListeners(BaseAnimation.ANIMATION_EVENT_DONE);
    }

    addListener(event: AnimationEventTypes, callback: AnimationCallbackFunction) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
    }

    whenHalfDone(callback: AnimationCallbackFunction) {
        this.addListener(BaseAnimation.ANIMATION_EVENT_HALF_DONE, callback);
        return this;
    }

    whenDone(callback: AnimationCallbackFunction) {
        this.addListener(BaseAnimation.ANIMATION_EVENT_DONE, callback);
        return this;
    }

    callListeners(event: AnimationEventTypes) {
        if (!this.listeners[event]) { return; }
        this.listeners[event].forEach((callback: AnimationCallbackFunction) => {
            callback();
        });
    }

    isDone() {
        return true;
    }

    hasSprite() {
        return false;
    }

    createSprite(pixiLoader: PIXI.Loader) {}
    addSprites(effectContainer: PIXI.Container) {}
    removeSprites() {}
}
