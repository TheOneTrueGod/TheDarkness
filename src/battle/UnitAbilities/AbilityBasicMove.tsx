import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetTypes, AbilityTargetRestrictions, getTileCoordFromAbilityTarget } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import ClientBattleMap from '../BattleMap/ClientBattleMap';
import { getManhattenDistance } from '../BattleHelpers';
import { SpriteList } from '../SpriteUtils';
import GameDataManager from '../Managers/GameDataManager';
import UnitMoveAnimation from "../Managers/Animations/UnitMoveAnimation";

export default class AbilityBasicMove extends BaseAbility {
    minRange = 1;
    maxRange = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ emptyTile: true, maxRange: this.maxRange }];
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        const targetPos = getTileCoordFromAbilityTarget(targets[0]);
        const previousCoord = unit.tileCoord;
        gameDataManager.unitManager.moveUnit(unit, targetPos, gameDataManager.clientBattleMap);
        gameDataManager.animationManager.addAnimation(
            new UnitMoveAnimation(unit, previousCoord)
        ).whenDone(() => {
            doneCallback();
        });
    }

    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return unit.hasAbilityPoints(AbilityPointType.MOVEMENT, 1);
    }

    spendResources(unit: BattleUnit) {
        unit.useAbilityPoints(AbilityPointType.MOVEMENT, 1);
    }

    canUnitUseAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!gameDataManager.clientBattleMap.isTileEmpty(getTileCoordFromAbilityTarget(targets[0]))) {
            return false;
        }

        if (gameDataManager.unitManager.getUnitAtTileCoord(getTileCoordFromAbilityTarget(targets[0]), gameDataManager.clientBattleMap)) {
            return false;
        }

        if (getManhattenDistance(unit.tileCoord, getTileCoordFromAbilityTarget(targets[0])) > this.maxRange) {
            return false;
        }

        return true;
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'M',
            icon: SpriteList.CROSSHAIR,
        }
    }
}