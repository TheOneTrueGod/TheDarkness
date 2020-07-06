import BattleUnit from "../BattleUnits/BattleUnit";
import { UnitOwner, TileCoord } from "../BattleTypes";
import { tileCoordToInteger, positionToTileCoord } from "../BattleHelpers";

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
                const tileCoord = battleUnit.tileCoord;
                const positionNumber = tileCoordToInteger({
                    x: tileCoord.x + xOffset,
                    y: tileCoord.y + yOffset
                });

                this.unitsByPosition[positionNumber] = battleUnit;
            }
        }
    }

    removeUnitBattlePosition(battleUnit: BattleUnit) {
        const unitSize = battleUnit.getUnitSize();
        for (let xOffset = 0; xOffset < unitSize.x; xOffset++) {
            for (let yOffset = 0; yOffset < unitSize.y; yOffset++) {
                const tileCoord = battleUnit.tileCoord;
                const positionNumber = tileCoordToInteger({
                    x: tileCoord.x + xOffset,
                    y: tileCoord.y + yOffset
                });

                delete this.unitsByPosition[positionNumber];
            }
        }
    }

    moveUnit(unit: BattleUnit, targetTile: TileCoord) {
        this.removeUnitBattlePosition(unit);
        unit.setTileCoord(targetTile);
        this.setBattleUnitPosition(unit);
    }
    
    getUnitAtTileCoord(tileCoord: TileCoord): BattleUnit | null {
        const tileNumber = tileCoordToInteger(tileCoord);
        const unit = this.unitsByPosition[tileNumber];
        return unit || null;
    }

    updateCurrentTurn(currentTurn: UnitOwner) {
        this.unitList.forEach((unit) => {
            // TODO: This needs to include things like 'does the unit have any actions left'
            unit.setShowReadyForAction(currentTurn === unit.owner);
        });
    }

}