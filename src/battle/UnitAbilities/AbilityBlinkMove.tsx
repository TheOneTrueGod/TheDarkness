import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetTypes, AbilityTargetRestrictions } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import ClientBattleMap from '../BattleMap/ClientBattleMap';
import { UnitResourceTypes } from '../BattleUnits/UnitResources';
import { getManhattenDistance } from '../BattleHelpers';
import { SpriteList } from '../SpriteUtils';
import GameDataManager from '../Managers/GameDataManager';

export default class AbilityBlinkMove extends BaseAbility {
    energyCost = 3;
    movementPointCost = 1;
    maxRange = 3;
    minRange = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ emptyTile: true, maxRange: this.maxRange }];
    }

    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return unit.hasAbilityPoints(AbilityPointType.MOVEMENT, this.movementPointCost) && 
        unit.hasResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost);
    }

    spendResources(unit: BattleUnit) {
        unit.useAbilityPoints(AbilityPointType.MOVEMENT, this.movementPointCost);
        unit.useResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost);
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager.clientBattleMap, gameDataManager.unitManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        gameDataManager.unitManager.moveUnit(unit, targets[0] as TileCoord, gameDataManager.clientBattleMap);
        doneCallback();
    }

    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!clientBattleMap.isTileEmpty(targets[0] as TileCoord)) {
            return false;
        }

        if (unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap)) {
            return false;
        }

        if (getManhattenDistance(unit.tileCoord, targets[0] as TileCoord) > this.maxRange) {
            return false;
        }
        
        return true;
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'Bl',
            icon: SpriteList.POSITION_MARKER,
        }
    }
}