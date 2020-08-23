export enum UnitResourceTypes {
    HEALTH = 'health',
    BLINK_ENERGY = 'blink energy',
}

export type UnitResourceDisplayDefType = {
    color: string;
    pointsPerPip: number;
}

export default class UnitResource {
    type: UnitResourceTypes;
    current: number;
    max: number;

    displayCurrent: number;
    displayMax: number;
    constructor(type: UnitResourceTypes, max: number, current?: number) {
        this.type = type;
        this.current = (current === undefined) ? max : current;
        this.max = max;

        this.displayCurrent = this.current;
        this.displayMax = this.max;
    }

    loseResource(amount: number, updateDisplay: boolean = false) {
        this.current -= amount;
        if (updateDisplay) { this.displayCurrent = this.current; }
    }

    spendResource(amount: number) {
        if (this.current < amount) { throw new Error(`Unit doesn't have enough of ${this.type} resource!`)}
        this.current -= amount;
    }

    loseDisplayResource(amount: number) {
        this.displayCurrent -= amount;
    }

    getDisplayDef(): UnitResourceDisplayDefType {
        return UnitResourceDisplayDefs[this.type];
    }

}

const UnitResourceDisplayDefs: Record<UnitResourceTypes, UnitResourceDisplayDefType> = {
    [UnitResourceTypes.HEALTH]: {
        color: '#FF0000',
        pointsPerPip: 1
    },
    [UnitResourceTypes.BLINK_ENERGY]: {
        color: '#FF00FF',
        pointsPerPip: 3
    }
}