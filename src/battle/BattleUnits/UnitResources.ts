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
    constructor(type: UnitResourceTypes, max: number, current?: number) {
        this.type = type;
        this.current = (current === undefined) ? max : current;
        this.max = max;
    }

    loseResource(amount: number) {
        this.current -= amount;
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