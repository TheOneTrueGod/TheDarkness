import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import UnitManager from "../Managers/UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import { SpriteList } from "../SpriteUtils";
import { getManhattenDistance } from "../BattleHelpers";
import GameDataManager from "../Managers/GameDataManager";

interface AbilityInterface {
    playOutAbility: Function;
    getTargetRestrictions: Function;
    canUnitUseAbility: Function;
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
    maxRange? : number;
}

export type AbilityDisplayDetails = {
    icon: SpriteList,
    tempDisplayLetter: string,
}

export default abstract class BaseAbility implements AbilityInterface {
    minRange: number = 1;
    maxRange: number = 1;
    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {}
    getTargetRestrictions(): Array<AbilityTargetRestrictions> { return []; }
    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, unit: BattleUnit, targets: Array<AbilityTarget>) { return false; }
    getDisplayDetails(): AbilityDisplayDetails { return { icon: SpriteList.CIRCLE, tempDisplayLetter: '?' } }
    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return false;
    }

    spendResources(unit: BattleUnit) { }

    getMinMaxRange(): [number, number] {
        return [0, this.maxRange];
    }

    isValidTarget(targetIndex: number, target: AbilityTarget, unit: BattleUnit, clientBattleMap: ClientBattleMap): boolean {
        const targetRestrictions = this.getTargetRestrictions();
        if (targetIndex < 0 || targetIndex >= targetRestrictions.length) { return false; }
        const restrictions = targetRestrictions[targetIndex];
        if (targetMeetsRestrictions(unit, target, restrictions, clientBattleMap)) { return true; }
        return false;
    }

    getTilesInRange(unit: BattleUnit): Array<TileCoord> {
        const [minRange, maxRange] = this.getMinMaxRange();
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

function determineIfTargetIsTileCoord(toBeDetermined: AbilityTarget): toBeDetermined is TileCoord {
    if ((toBeDetermined as TileCoord).x && (toBeDetermined as TileCoord).y) {
        return true;
    }
    return false;
}

function determineIfTargetIsBattleUnit(toBeDetermined: AbilityTarget): toBeDetermined is BattleUnit {
    if (toBeDetermined instanceof BattleUnit) {
        return true;
    }
    return false;
}

function targetMeetsRestrictions(
    unit: BattleUnit,
    target: AbilityTarget,
    restrictions: AbilityTargetRestrictions,
    clientBattleMap: ClientBattleMap,
) {
    if (restrictions.emptyTile) {
        if (determineIfTargetIsTileCoord(target)) {
            if (!clientBattleMap.isTileEmpty(target)) { return false; }
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

    if (restrictions.maxRange !== undefined) {
        if (determineIfTargetIsTileCoord(target) && getManhattenDistance(unit.tileCoord, target) > restrictions.maxRange) {
            return false;
        }
        if (determineIfTargetIsBattleUnit(target) && getManhattenDistance(unit.tileCoord, target.tileCoord) > restrictions.maxRange) {
            return false;
        }
    }

    return true;
}