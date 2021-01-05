import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetRestrictions, determineIfTargetIsBattleUnit } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import { SpriteList } from '../SpriteUtils';
import GameDataManager from '../Managers/GameDataManager';
import UnitStepForwardBackAnimation from '../Managers/Animations/UnitStepForwardBackAnimation';

export default class AbilityBasicAttack extends BaseAbility {
    minRange = 1;
    maxRange = 1;
    damage = 1;
    actionPointCost = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ enemyUnit: true, maxRange: this.maxRange }];
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        const targetUnit = targets[0] as BattleUnit;
        targetUnit.dealDamage(this.damage);
        gameDataManager.animationManager.addAnimation(
            new UnitStepForwardBackAnimation(unit, targetUnit.tileCoord)
        ).addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
            targetUnit.dealDisplayDamage(this.damage);
        })
        .whenDone(() => {
            doneCallback();
        });
        doneCallback();
    }

    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return unit.hasAbilityPoints(AbilityPointType.ACTION, this.actionPointCost);
    }

    spendResources(unit: BattleUnit) {
        unit.useAbilityPoints(AbilityPointType.ACTION, this.actionPointCost);
    }

    canUnitUseAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
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