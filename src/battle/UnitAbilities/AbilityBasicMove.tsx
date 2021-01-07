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
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ emptyTile: true, minRange: 1, maxRange: 1 }];
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
        const target = getTileCoordFromAbilityTarget(targets[0]);

        if (!gameDataManager.clientBattleMap.canUnitMoveIntoTile(unit, target, gameDataManager)) {
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