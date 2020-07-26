import BattleUnit from "../BattleUnits/BattleUnit";
import { TileCoord, CurrentTurn, Team } from "../BattleTypes";
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

    updateUnitDebugSprites(pixiLoader: PIXI.Loader, debugContainer: PIXI.Sprite) {
        this.unitList.forEach((unit) => {
            unit.updateDebugSprites(pixiLoader, debugContainer);
        });
    }
    
    getUnitAtTileCoord(tileCoord: TileCoord): BattleUnit | null {
        const tileNumber = tileCoordToInteger(tileCoord);
        const unit = this.unitsByPosition[tileNumber];
        return unit || null;
    }

    onStartTurn(currentTurn: CurrentTurn) {
        this.unitList.forEach((unit) => {
            // TODO: This needs to include things like 'does the unit have any actions left'
            unit.setShowReadyForAction(currentTurn.owner === unit.owner && currentTurn.team === unit.team);
        });
    }

    onEndTurn(currentTurn: CurrentTurn) {
        this.unitList.forEach((unit) => {
            // TODO: This needs to include things like 'does the unit have any actions left'
            unit.setShowReadyForAction(currentTurn.owner === unit.owner && currentTurn.team === unit.team);
            if (unit.owner === currentTurn.owner && unit.team === currentTurn.team) {
                unit.onTurnStart();
            }
        });
    }

    getUnitsControlledByTeams(teams: Array<Team>, filter: Function = null) {
        return this.unitList.filter((unit: BattleUnit) => 
            teams.includes(unit.team) && (filter === null || filter(unit)) && unit.canAct()
        );
    }

    getUnitsOnOppositeTeam(team: Team) {
        switch (team) {
            case 'allies':
            case 'players':
                return this.getUnitsControlledByTeams(
                    ['enemies'],
                    (unit: BattleUnit) => unit.isTargetable() && unit.isOnOppositeTeam(team)
                );
            case 'enemies':
                return this.getUnitsControlledByTeams(
                    ['allies', 'players'],
                    (unit: BattleUnit) => unit.isTargetable() && unit.isOnOppositeTeam(team)
                );
        }
    }
}