import { CrossbowBoltTypes } from "../UnitAbilities/TreeCrossbow/CrossbowHelpers";

export enum UnitResourceTypes {
    HEALTH = 'health',
    BLINK_ENERGY = 'blink energy',
    CROSSBOW_BOLTS = 'crossbow bolts',
}

export type UnitResourceMetadata = {
    crossbowBoltType?: CrossbowBoltTypes;
}


export type UnitResourceDisplayDefType = {
    color: string;
    pointsPerPip: number;
}

export default class UnitResource {
    type: UnitResourceTypes;
    current: number;
    max: number;
    dataValues: Array<UnitResourceMetadata>;

    displayCurrent: number;
    displayMax: number;
    constructor(type: UnitResourceTypes, startingMetadata: UnitResourceMetadata, max: number, current?: number, ) {
        this.type = type;
        this.current = (current === undefined) ? max : current;
        this.max = max;

        this.displayCurrent = this.current;
        this.displayMax = this.max;

        this.dataValues = [];
        for (let i = 0; i < current; i++) {
            this.dataValues.push(startingMetadata);
        }
        for (let i = current; i < max; i++) {
            this.dataValues.push({});
        }
    }

    loseResource(amount: number, updateDisplay: boolean = false) {
        const current = this.current;
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

    gainResource(amount: number, metaData: UnitResourceMetadata) {
        /*const start = this.current;
        this.current = Math.min(this.current + amount, this.max);
        for (let i = start; i < this.current; i++) {
            this.dataValues[i] = { ...metaData };
        }*/
        for (let i = 0; i < amount; i++) {
            if (this.current < this.max) {
                this.current += 1;
                this.dataValues[this.current] = { ...metaData };
            } else {
                this.dataValues.shift();
                this.dataValues.push({ ...metaData });
            }
        }
    }

    gainDisplayResource(amount: number) {
        this.displayCurrent = Math.min(this.current + amount, this.max);
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
    },
    [UnitResourceTypes.CROSSBOW_BOLTS]: {
        color: 'gray',
        pointsPerPip: 1,
    }
}