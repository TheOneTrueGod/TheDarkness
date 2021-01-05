import Battle from "../../../object_defs/Campaign/Mission/Battle/Battle";
import { rotateMatrix } from "../../app/helpers";
import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import GameDataManager from "../Managers/GameDataManager";

export type AbilityAoE = {
    centerOffset: TileCoord,
    square: Array<number>
};

export function getRotatedTargetSquares(sourceCoord: TileCoord, targetCoord: TileCoord, targetsWhenAimingUp: AbilityAoE): AbilityAoE {
    const targetOffset = { x: targetCoord.x - sourceCoord.x, y: targetCoord.y - sourceCoord.y };
    const aimAngle = Math.atan2(targetOffset.y, targetOffset.x);
    if (-3 * Math.PI / 4 < aimAngle && aimAngle <= -Math.PI / 4) { // Aiming up
        return targetsWhenAimingUp;
    } else if (-Math.PI / 4 < aimAngle && aimAngle <= Math.PI / 4) { // Aiming right
        return { ...targetsWhenAimingUp, square: rotateMatrix(targetsWhenAimingUp.square, 1) };
    } else if (Math.PI / 4 < aimAngle && aimAngle <= 3 * Math.PI / 4) { // Aiming down
        return { ...targetsWhenAimingUp, square: rotateMatrix(targetsWhenAimingUp.square, 2) };
    }
    return { ...targetsWhenAimingUp, square: rotateMatrix(targetsWhenAimingUp.square, 3) };
}

export function convertAoEToCoords(targetCoord: TileCoord, targetsWhenAimingUp: AbilityAoE): Array<TileCoord> {
    const rowLength = Math.sqrt(targetsWhenAimingUp.square.length);
    const targets = [];
    for (let i = 0; i < targetsWhenAimingUp.square.length; i++) {
        if (targetsWhenAimingUp.square[i] === 0) {
            continue;
        }
        var x = i % rowLength;
        var y = Math.floor(i / rowLength);

        targets.push({
            x: x - targetsWhenAimingUp.centerOffset.x + targetCoord.x,
            y: y - targetsWhenAimingUp.centerOffset.y + targetCoord.y
        });
    }
    return targets;
}

export function getUnitsInSquares(squares: Array<TileCoord>, gameDataManager: GameDataManager): Array<BattleUnit> {
    const unitsInSquares: Array<BattleUnit|null> = squares.map((square: TileCoord) => 
        gameDataManager.unitManager.getUnitAtTileCoord(square, gameDataManager.clientBattleMap)
    );
    return unitsInSquares.filter((unit: BattleUnit | null) => unit !== null);
}

export function getUnitsInAoE(sourceCoord: TileCoord, targetCoord: TileCoord, targetsWhenAimingUp: AbilityAoE, gameDataManager: GameDataManager): Array<BattleUnit> {
    const rotatedAoE = getRotatedTargetSquares(sourceCoord, targetCoord, targetsWhenAimingUp);
    const targetCoords = convertAoEToCoords(targetCoord, rotatedAoE);
    const unitsInSquares = getUnitsInSquares(targetCoords, gameDataManager);
    return unitsInSquares;
}