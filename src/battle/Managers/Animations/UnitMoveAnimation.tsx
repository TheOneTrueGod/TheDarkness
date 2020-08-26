import BattleUnit from "../../BattleUnits/BattleUnit";
import BaseAnimation from "./BaseAnimation";
import { TileCoord } from "../../BattleTypes";
import { tileCoordToPosition, lerpPosition } from "../../BattleHelpers";

export default class UnitMoveAnimation extends BaseAnimation {
    unit: BattleUnit;
    targetPos: TileCoord;
    speed: number;
    tickOn: number = 0;
    
    readonly duration = 20;

    constructor(unit: BattleUnit, previousCoord: TileCoord, speed: number = 1) {
        super();
        this.unit = unit;
        this.targetPos = tileCoordToPosition({ x: previousCoord.x - unit.tileCoord.x, y: previousCoord.y - unit.tileCoord.y });
        this.speed = speed;
    }

    playAnimation() {
        const previousTick = this.tickOn;
        this.tickOn += 1;
        const percentDone = Math.min(this.tickOn / this.duration, 1);
        this.unit.setSpriteOffset(lerpPosition(this.targetPos, { x: 0, y: 0 }, percentDone));
        if (previousTick / this.duration < 0.5 && this.tickOn / this.duration >= 0.5) {
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