import BattleUnit from "../../BattleUnits/BattleUnit";
import BaseAnimation, { AnimationEventTypes } from "./BaseAnimation";
import { TileCoord } from "../../BattleTypes";
import { tileCoordToPosition, lerpPosition } from "../../BattleHelpers";

export default class UnitStepForwardBackAnimation extends BaseAnimation {
    public static readonly FIRST_PART_DONE = AnimationEventTypes.FIRST_PART_DONE;
    unit: BattleUnit;
    targetPos: TileCoord;
    speed: number;
    tickOn: number = 0;
    
    readonly duration = 20;

    constructor(unit: BattleUnit, targetCoord: TileCoord, speed: number = 1) {
        super();
        this.unit = unit;
        this.targetPos = tileCoordToPosition({ 
            x: (targetCoord.x - unit.tileCoord.x) / 2,
            y: (targetCoord.y - unit.tileCoord.y) / 2
        });
        this.speed = speed;
    }

    playAnimation() {
        const firstPart = this.duration / 2;
        const secondPart = this.duration / 2;
        let lastTick = this.tickOn;
        this.tickOn += 1;

        if (lastTick < firstPart && this.tickOn >= firstPart) {
            this.callListeners(UnitStepForwardBackAnimation.FIRST_PART_DONE);
        }

        let percentDone = 0;
        let partOn = 0;
        if (this.tickOn < firstPart) {
            percentDone = Math.min(this.tickOn / firstPart, 1);
            partOn = 0;
        } else {
            percentDone = Math.min((this.tickOn - firstPart) / secondPart, 1);
            partOn = 1;
        }
        if (partOn == 0) {
            this.unit.setSpriteOffset(lerpPosition({ x: 0, y: 0 }, this.targetPos, percentDone));
        } else {
            this.unit.setSpriteOffset(lerpPosition(this.targetPos, { x: 0, y: 0 }, percentDone));
        }

        if (lastTick / this.duration < 0.5 && this.tickOn / this.duration >= 0.5) {
            this.callListeners(BaseAnimation.ANIMATION_EVENT_HALF_DONE);
        }
        
        if (this.isDone()) {
            this.callListeners(BaseAnimation.ANIMATION_EVENT_DONE);
        }
    }

    isDone() {
        return this.tickOn >= this.duration;
    }
}