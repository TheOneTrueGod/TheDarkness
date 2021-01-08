import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetRestrictions, determineIfTargetIsBattleUnit } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import { SpriteList } from '../SpriteUtils';
import GameDataManager from '../Managers/GameDataManager';
import UnitStepForwardBackAnimation from '../Managers/Animations/UnitStepForwardBackAnimation';
import SpriteEffectAnimation, { SpriteEffectNames, SpriteEffects } from '../Managers/Animations/SpriteEffectAnimation';

export default class AbilityBasicAttack extends BaseAbility {
    damage = 1;
    actionPointCost = 1;
    movePointCost = 0;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ enemyUnit: true, minRange: 1, maxRange: 1 }];
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
            gameDataManager.animationManager.addAnimation(
                new SpriteEffectAnimation(SpriteEffects[SpriteEffectNames.SwordSlashes], targetUnit.tileCoord, 30, 0, 2)
            );
        })
        .whenDone(() => {
            doneCallback();
        });
    }

    doesUnitHaveResourcesForAbility(unit: BattleUnit) {
        return unit.hasAbilityPoints(AbilityPointType.ACTION, this.actionPointCost) && unit.hasAbilityPoints(AbilityPointType.MOVEMENT, this.movePointCost);
    }

    spendResources(unit: BattleUnit) {
        unit.useAbilityPoints(AbilityPointType.ACTION, this.actionPointCost);
        unit.useAbilityPoints(AbilityPointType.MOVEMENT, this.movePointCost);
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