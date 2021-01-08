import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import UnitManager from "../Managers/UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import { SpriteList } from "../SpriteUtils";
import { getManhattenDistance } from "../BattleHelpers";
import GameDataManager from "../Managers/GameDataManager";
import { AbilityAoE, getUnitsInAoE } from "./AbilityHelpers";

interface AbilityInterface {
    playOutAbility: Function;
    getTargetRestrictions: Function;
    canUnitUseAbility: Function;
    getAbilityAoE: Function;
}

export type AbilityTarget = TileCoord | BattleUnit;
export enum AbilityTargetTypes {
    EmptyTile = 'EmptyTile',
    TileCoord = 'TileCoord',
    BattleUnit = 'BattleUnit',
}

export type AbilityTargetRestrictions = {
    emptyTile? : boolean;
    enemyUnit? : boolean;
    enemyUnitInAoE? : boolean;
    minRange : number;
    maxRange : number;
    customFunction?: (user: BattleUnit, source: TileCoord, target: AbilityTarget, gameDataManager: GameDataManager) => boolean;
}

export type AbilityDisplayDetails = {
    icon: SpriteList,
    tempDisplayLetter: string,
}

export default abstract class BaseAbility implements AbilityInterface {
    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {}
    getTargetRestrictions(): Array<AbilityTargetRestrictions> { return []; }
    canUnitUseAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>) { return false; }
    getDisplayDetails(): AbilityDisplayDetails { return { icon: SpriteList.CIRCLE, tempDisplayLetter: '?' } }
    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return false;
    }

    getAbilityAoE(): AbilityAoE {
        return {
            centerOffset: { x: 0, y: 0 },
            square: [1],
        }
    }

    spendResources(unit: BattleUnit) { }

    isValidTarget(targetIndex: number, target: AbilityTarget, unit: BattleUnit, gameDataManager: GameDataManager): boolean {
        const targetRestrictions = this.getTargetRestrictions();
        if (targetIndex < 0 || targetIndex >= targetRestrictions.length) { return false; }
        const restrictions = targetRestrictions[targetIndex];
        if (targetMeetsRestrictions(unit, target, restrictions, this, gameDataManager)) { return true; }
        return false;
    }

    getTilesInRange(unit: BattleUnit, targetIndex: number): Array<TileCoord> {
        const restrictions = this.getTargetRestrictions();
        if (restrictions.length <= targetIndex) {
            return [];
        }
        const { minRange, maxRange } = restrictions[targetIndex];
        const unitPos = unit.tileCoord;

        const tilesInRange = []; 
        if (minRange === 0) {
            tilesInRange.push({ ...unitPos });
        }
        for (let range = Math.max(minRange, 1); range <= maxRange; range++) {
            /*
            range = 3;
            i = 0; x = 0, y = 3;
            i = 1; x = 1, y = 2;
            i = 2; x = 2, y = 1;
            */
            for (let i = 0; i < range; i++) {
                // Up to Right
                tilesInRange.push({ x: unitPos.x + i, y: unitPos.y + range - i });
                // Right to Down
                tilesInRange.push({ x: unitPos.x + range - i, y: unitPos.y -i });
                // Down to Left
                tilesInRange.push({ x: unitPos.x - i, y: unitPos.y - (range - i) });
                // Left to Up
                tilesInRange.push({ x: unitPos.x - (range - i), y: unitPos.y + i });
            }
        }
        return tilesInRange;
    }
}

export function determineIfTargetIsTileCoord(toBeDetermined: AbilityTarget): toBeDetermined is TileCoord {
    if ((toBeDetermined as TileCoord).x && (toBeDetermined as TileCoord).y) {
        return true;
    }
    return false;
}

export function determineIfTargetIsBattleUnit(toBeDetermined: AbilityTarget): toBeDetermined is BattleUnit {
    if (toBeDetermined instanceof BattleUnit) {
        return true;
    }
    return false;
}

export function getTileCoordFromAbilityTarget(target: AbilityTarget): TileCoord {
    return determineIfTargetIsTileCoord(target) ? target as TileCoord : (target as BattleUnit).tileCoord
}

function targetMeetsRestrictions(
    unit: BattleUnit,
    target: AbilityTarget,
    restrictions: AbilityTargetRestrictions,
    ability: BaseAbility,
    gameDataManager: GameDataManager,
) {
    const tileTarget = getTileCoordFromAbilityTarget(target);

    if (restrictions.emptyTile) {
        if (determineIfTargetIsTileCoord(target)) {
            if (!gameDataManager.clientBattleMap.isTileEmpty(target)) { return false; }
        } else {
            return false;
        }
    }

    if (restrictions.enemyUnit) {
        if (determineIfTargetIsBattleUnit(target)) {
            if (!unit.isOnOppositeTeam(target.team)) {
                return false;
            }
        } else {
            return false;
        }
    }

    if (restrictions.enemyUnitInAoE) {
        const unitsInAoE = getUnitsInAoE(unit.tileCoord, getTileCoordFromAbilityTarget(target), ability.getAbilityAoE(), gameDataManager);
        const enemyUnits = unitsInAoE.filter(battleUnit => battleUnit.isOnOppositeTeam(unit.team));
        if (!enemyUnits.length) {
            return false;
        }
    }

    if (restrictions.minRange !== undefined) {
        if (getManhattenDistance(unit.tileCoord, tileTarget) < restrictions.minRange) {
            return false;
        }
    }

    if (restrictions.maxRange !== undefined) {
        if (getManhattenDistance(unit.tileCoord, tileTarget) > restrictions.maxRange) {
            return false;
        }
    }

    if (restrictions.customFunction !== undefined) {
        if (!restrictions.customFunction(unit, unit.tileCoord, target, gameDataManager)) {
            return false;
        }
    }

    return true;
}