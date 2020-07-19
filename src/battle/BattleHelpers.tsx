import BattleUnit from './BattleUnits/BattleUnit';
import { UnitOwner, TileCoord, OWNER_PLAYERS, GamePosition, CardinalDirection, CurrentTurn } from './BattleTypes';
import Battle from '../../object_defs/Campaign/Mission/Battle/Battle';
import CaravanUnit from './BattleUnits/CaravanUnit';
import Mission from '../../object_defs/Campaign/Mission/Mission';
import { getTileSize } from './BattleConstants';
import { EnemyWolfUnitDef } from './BattleUnits/UnitDef';

export function getTurnForInitiativeNumber(
    initiativeNumber: number,
    unitList: Array<BattleUnit>
): CurrentTurn {
    return {
        team: 'players',
        owner: unitList[1].owner
    };
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

export function tileCoordToInteger(tileCoord: TileCoord): number {
    const { y: tileSizeY } = getTileSize();
    return tileCoord.y * tileSizeY + tileCoord.x;
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
            { x: 8, y: 3 + i }
        );

        console.log(enemyUnit);

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