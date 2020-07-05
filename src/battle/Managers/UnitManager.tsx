import BattleUnit from "../BattleUnits/BattleUnit";
import { UnitOwner, TileCoord } from "../BattleTypes";
import { tileCoordToInteger } from "../BattleHelpers";

export default class UnitManager {
    unitList: Array<BattleUnit>;
    unitsByPosition: Record<number, BattleUnit>

    constructor() {
        this.unitList = [];
        this.unitsByPosition = {};
    }

    addBattleUnit(battleUnit: BattleUnit) {
        this.unitList.push(battleUnit);
        this.setBattleUnitPosition(battleUnit);
    }

    setBattleUnitPosition(battleUnit: BattleUnit) {
        const unitSize = battleUnit.getUnitSize();
        for (let xOffset = 0; xOffset < unitSize.x; xOffset++) {
            for (let yOffset = 0; yOffset < unitSize.y; yOffset++) {
                const positionNumber = tileCoordToInteger({
                    x: battleUnit.position.x + xOffset,
                    y: battleUnit.position.y + yOffset
                });

                this.unitsByPosition[positionNumber] = battleUnit;
            }
        }
    }
    
    getUnitAtTileCoord(tileCoord: TileCoord): BattleUnit | null {
        const unit = this.unitsByPosition[tileCoordToInteger(tileCoord)];
        return unit || null;
    }

    updateCurrentTurn(currentTurn: UnitOwner) {
        this.unitList.forEach((unit) => {
            // TODO: This needs to include things like 'does the unit have any actions left'
            unit.setShowReadyForAction(currentTurn === unit.owner);
        });
    }

}