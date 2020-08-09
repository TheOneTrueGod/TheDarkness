import BattleUnit from './BattleUnits/BattleUnit';
import { TileCoord, OWNER_PLAYERS, GamePosition, CardinalDirection, CurrentTurn, EnemyOwner } from './BattleTypes';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import CaravanUnit from './BattleUnits/CaravanUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import { getTileSize } from './BattleConstants';
import { EnemyWolfUnitDef } from './BattleUnits/UnitDef';
import UnitManager from './Managers/UnitManager';
// @ts-ignore
import { astar, Graph } from './lib/astar';
import ClientBattleMap from './BattleMap/ClientBattleMap';

function findNextInList(currentElement: any, list: Array<any>): any {
    const index = list.indexOf(currentElement);
    if (index === -1) { return list[0] };
    if (index + 1 >= list.length) {
        return null;
    }
    return list[index + 1];
}

export function getNextTurn(
    currentTurn: CurrentTurn,
    playerIDs: Array<number>,
): CurrentTurn {
    const enemyOwners: Array<EnemyOwner> = ['owner_boss', 'owner_elite', 'owner_minion'];
    switch (currentTurn.team) {
        case 'players':
            const nextPlayerOwner = findNextInList(currentTurn.owner, playerIDs);
            if (nextPlayerOwner) {
                return {
                    team: 'players',
                    owner: nextPlayerOwner
                };
            }
            return { team: 'allies', owner: 'owner_players' };
        case 'allies':
            return {
                team: 'enemies',
                owner: enemyOwners[0]
            };
        case 'enemies':
            const nextEnemyOwner = findNextInList(currentTurn.owner, enemyOwners)
            if (nextEnemyOwner) {
                return {
                    team: 'enemies',
                    owner: nextEnemyOwner
                }
            }
            return { team: 'players', owner: playerIDs[0] };
    }
    throw new Error("Shouldn't have been able to reach here");
}

export function isAITurn(currentTurn: CurrentTurn) {
    return currentTurn.team === 'enemies' || currentTurn.team === 'allies';
}

export function positionToTileCoord(position: GamePosition): TileCoord {
    const { x: tileSizeX, y: tileSizeY } = getTileSize();
    const tileCoord = { 
        x: Math.floor(position.x / tileSizeX),
        y: Math.floor(position.y / tileSizeY),
    };

    return tileCoord;
}

export function tileCoordToPosition(tileCoord: TileCoord): GamePosition {
    const { x: tileSizeX, y: tileSizeY } = getTileSize();
    const gamePosition = { 
        x: Math.floor(tileCoord.x * tileSizeX),
        y: Math.floor(tileCoord.y * tileSizeY),
    };

    return gamePosition;
}

export function tileCoordToInteger(tileCoord: TileCoord, mapSize: TileCoord): number {
    const { x: tileSizeX } = mapSize;
    return tileCoord.y * tileSizeX + tileCoord.x;
}

export function integerToTileCoord(positionNumber: number, mapSize: TileCoord): TileCoord {
    const y = Math.floor(positionNumber / mapSize.x);
    const x = positionNumber % mapSize.x;
    return { x, y };
}

export function createInitialBattleUnits(
    battle: Battle,
    mission: Mission,
    addBattleUnit: Function
) {
    const caravanUnit = new CaravanUnit(battle.unitIndex ++, OWNER_PLAYERS, battle.caravanPosition);
    addBattleUnit(caravanUnit);

    for (let i = 0; i < mission.caravan.unitList.length; i++) {
        const missionUnit = mission.caravan.unitList[i];
        const battleUnit = BattleUnit.fromMissionUnit(
            battle.unitIndex ++,
            missionUnit,
            {
                x: battle.caravanPosition.x - 1 + i,
                y: battle.caravanPosition.y + 2,
            }
        );
        addBattleUnit(battleUnit);
    }

    for (let i = 0; i < 5; i++) {
        const enemyUnit = new BattleUnit(
            EnemyWolfUnitDef,
            battle.unitIndex ++,
            'owner_minion',
            'enemies',
            { x: 10, y: 6 + i }
        );

        addBattleUnit(enemyUnit);
    }
}

export function getCardinalDirectionFromAngle(angle: number): CardinalDirection {
    if (-Math.PI * 3.0 / 4.0 < angle && angle <= -Math.PI * 1.0 / 4.0) {
        return CardinalDirection.NORTH;
    }

    if (-Math.PI * 1.0 / 4.0 < angle && angle <= Math.PI * 1.0 / 4.0) {
        return CardinalDirection.EAST;
    }

    if (Math.PI * 1.0 / 4.0 < angle && angle <= Math.PI * 3.0 / 4.0) {
        return CardinalDirection.SOUTH;
    }

    return CardinalDirection.WEST;
}

export function getManhattenDistance(pos1: TileCoord, pos2: TileCoord): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

export function getShortestPath(
    pos1: TileCoord,
    pos2: TileCoord,
    clientBattleMap: ClientBattleMap,
    unitManager: UnitManager,
): Array<TileCoord> {
    const searchGraph = new Graph((coord: TileCoord) => {
        if (!isTileWalkable(coord, unitManager, clientBattleMap)) { return 0; }
        return 1;
    }, clientBattleMap.mapSize);

    const path = astar.search(searchGraph, pos1, pos2, { adjacent: true });
    return path;
}

export function isTileWalkable(tile: TileCoord, unitManager: UnitManager, clientBattleMap: ClientBattleMap) {
    if (unitManager.getUnitAtTileCoord(tile, clientBattleMap) !== null) { return false; }

    return true;
}

export function arePositionsEqual(pos1: TileCoord, pos2: TileCoord) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function cloneCoord(coord: TileCoord) {
    return { x: coord.x, y: coord.y };
}