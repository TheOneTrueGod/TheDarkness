import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetTypes, AbilityTargetRestrictions } from './BaseAbility';
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
        if (!this.canUnitUseAbility(gameDataManager.clientBattleMap, gameDataManager.unitManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        const targetPos = targets[0] as TileCoord;
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
            tempDisplayLetter: 'M',
            icon: SpriteList.CROSSHAIR,
        }
    }
}