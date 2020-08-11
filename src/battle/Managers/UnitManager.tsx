import BattleUnit from "../BattleUnits/BattleUnit";
import { TileCoord, CurrentTurn, Team } from "../BattleTypes";
import { tileCoordToInteger } from "../BattleHelpers";
import ClientBattleMap from "../BattleMap/ClientBattleMap";

export default class UnitManager {
    unitList: Array<BattleUnit>;
    playerUnitList: Array<BattleUnit>;
    unitsByPosition: Record<number, BattleUnit>

    constructor() {
        this.unitList = [];
        this.playerUnitList = [];
        this.unitsByPosition = {};
    }

    addBattleUnit(battleUnit: BattleUnit, clientBattleMap: ClientBattleMap) {
        this.unitList.push(battleUnit);
        if (battleUnit.team === 'players' || battleUnit.team === 'allies') {
            this.playerUnitList.push(battleUnit);
        }
        this.setBattleUnitPosition(battleUnit, clientBattleMap);
    }

    setBattleUnitPosition(battleUnit: BattleUnit, clientBattleMap: ClientBattleMap) {
        const unitSize = battleUnit.getUnitSize();
        for (let xOffset = 0; xOffset < unitSize.x; xOffset++) {
            for (let yOffset = 0; yOffset < unitSize.y; yOffset++) {
                const tileCoord = battleUnit.tileCoord;
                const positionNumber = tileCoordToInteger({
                    x: tileCoord.x + xOffset,
                    y: tileCoord.y + yOffset
                }, clientBattleMap.getMapSize());

                this.unitsByPosition[positionNumber] = battleUnit;
            }
        }
    }

    removeUnitBattlePosition(battleUnit: BattleUnit, clientBattleMap: ClientBattleMap) {
        const unitSize = battleUnit.getUnitSize();
        for (let xOffset = 0; xOffset < unitSize.x; xOffset++) {
            for (let yOffset = 0; yOffset < unitSize.y; yOffset++) {
                const tileCoord = battleUnit.tileCoord;
                const positionNumber = tileCoordToInteger({
                    x: tileCoord.x + xOffset,
                    y: tileCoord.y + yOffset
                }, clientBattleMap.getMapSize());

                delete this.unitsByPosition[positionNumber];
            }
        }
    }

    moveUnit(unit: BattleUnit, targetTile: TileCoord, clientBattleMap: ClientBattleMap) {
        this.removeUnitBattlePosition(unit, clientBattleMap);
        unit.setTileCoord(targetTile);
        this.setBattleUnitPosition(unit, clientBattleMap);
    }

    updateUnitDebugSprites(pixiLoader: PIXI.Loader, debugContainer: PIXI.Sprite) {
        this.unitList.forEach((unit) => {
            unit.updateDebugSprites(pixiLoader, debugContainer);
        });
    }
    
    getUnitAtTileCoord(tileCoord: TileCoord, clientBattleMap: ClientBattleMap): BattleUnit | null {
        const tileNumber = tileCoordToInteger(tileCoord, clientBattleMap.getMapSize());
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

    getPlayerUnits() {
        return this.playerUnitList;
    }

    cleanupStep(clientBattleMap: ClientBattleMap) {
        let i = 0;
        while (i < this.unitList.length) {
            if (this.unitList[i].isDead()) {
                if (this.unitList[i].team === 'players') {
                    this.playerUnitList.splice(this.playerUnitList.indexOf(this.unitList[i]));
                }
                this.unitList[i].prepareForDeletion();
                this.removeUnitBattlePosition(this.unitList[i], clientBattleMap);
                this.unitList.splice(i, 1);
            } else {
                this.unitList[i].onCleanupStep(clientBattleMap);
                i += 1;
            }
        }
    }
}