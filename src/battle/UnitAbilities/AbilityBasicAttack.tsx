import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetRestrictions, determineIfTargetIsBattleUnit } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import { getManhattenDistance } from '../BattleHelpers';
import ClientBattleMap from '../BattleMap/ClientBattleMap';
import { SpriteList } from '../SpriteUtils';
import GameDataManager from '../Managers/GameDataManager';

export default class AbilityBasicAttack extends BaseAbility {
    minRange = 1;
    maxRange = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ enemyUnit: true, maxRange: this.maxRange }];
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager.clientBattleMap, gameDataManager.unitManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        const targetUnit = targets[0] as BattleUnit;
        targetUnit.dealDamage(1);
        doneCallback();
    }

    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return unit.hasAbilityPoints(AbilityPointType.ACTION, 1);
    }

    spendResources(unit: BattleUnit) {
        unit.useAbilityPoints(AbilityPointType.ACTION, 1);
    }

    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }
        
        return true;
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'A',
            icon: SpriteList.BROADSWORD,
        }
    }
}