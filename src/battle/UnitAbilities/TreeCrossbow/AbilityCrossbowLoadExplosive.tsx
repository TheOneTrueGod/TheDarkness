import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetRestrictions } from '../BaseAbility';
import BattleUnit from '../../BattleUnits/BattleUnit';
import { SpriteList } from '../../SpriteUtils';
import GameDataManager from '../../Managers/GameDataManager';
import UnitStepForwardBackAnimation from '../../Managers/Animations/UnitStepForwardBackAnimation';
import { CrossbowBoltTypes, CrossbowBoltAbility, isCriticalHit } from './CrossbowHelpers';
import { UnitResourceTypes } from '../../BattleUnits/UnitResources';
import SpriteEffectAnimation, { SpriteEffectNames, SpriteEffects } from '../../Managers/Animations/SpriteEffectAnimation';

export default class AbilityCrossbowLoadExplosive extends BaseAbility implements CrossbowBoltAbility {
    actionPointCost = 1;
    movePointCost = 1;
    damage = 1;
    explosiveDamage = 1;
    criticalDamageBonus = 1;
    isCriticalHit = isCriticalHit;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ minRange: 0, maxRange: 0 }];
    }

    playOutAbility(gameDataManager: GameDataManager, user: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        const amountToGain = 1;
        user.gainResource(UnitResourceTypes.CROSSBOW_BOLTS, amountToGain, { crossbowBoltType: CrossbowBoltTypes.EXPLOSIVE });
        gameDataManager.animationManager.addAnimation(
            new UnitStepForwardBackAnimation(user, { x: user.tileCoord.x - 1, y: user.tileCoord.y})
        ).addListener(UnitStepForwardBackAnimation.ANIMATION_EVENT_DONE, () => {
            user.gainDisplayResource(UnitResourceTypes.CROSSBOW_BOLTS, amountToGain);

            gameDataManager.animationManager.addAnimation(
                new UnitStepForwardBackAnimation(user, { x: user.tileCoord.x + 1, y: user.tileCoord.y})
            ).whenDone(() => {
                doneCallback();
            });
        });
    3}

    playOutAbilityInstantEffects(gameDataManager: GameDataManager, user: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        const targetUnit = targets[0] as BattleUnit;
        const damage = this.getDamage(user, targetUnit, gameDataManager);
        targetUnit.dealDamage(damage);
        const explodeTargets = gameDataManager.unitManager.getUnitsInSquare(
            { x: targetUnit.tileCoord.x - 1, y: targetUnit.tileCoord.y - 1},
            { x: targetUnit.tileCoord.x + 1, y: targetUnit.tileCoord.y + 1},
            gameDataManager.clientBattleMap
        );
        explodeTargets.forEach((target) => {
            if (target !== targetUnit) {
                target.dealDamage(this.explosiveDamage);
            }
        });
        
    }

    playOutAbilityDisplayEffects(gameDataManager: GameDataManager, user: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        const targetUnit = targets[0] as BattleUnit;
        const damage = this.getDamage(user, targetUnit, gameDataManager);
        targetUnit.dealDisplayDamage(damage);
        gameDataManager.animationManager.addAnimation(
            new SpriteEffectAnimation(SpriteEffects[SpriteEffectNames.SwordSlashes], targetUnit.tileCoord, 30, 0, 2)
        );

        const explodeTargets = gameDataManager.unitManager.getUnitsInSquare(
            { x: targetUnit.tileCoord.x - 1, y: targetUnit.tileCoord.y - 1},
            { x: targetUnit.tileCoord.x + 1, y: targetUnit.tileCoord.y + 1},
            gameDataManager.clientBattleMap
        );
        explodeTargets.forEach((explodeTarget) => {
            if (explodeTarget !== targetUnit) {
                explodeTarget.dealDisplayDamage(this.explosiveDamage);
                gameDataManager.animationManager.addAnimation(
                    new SpriteEffectAnimation(SpriteEffects[SpriteEffectNames.SwordSlashes], explodeTarget.tileCoord, 30, 0, 2)
                );
            }
        });
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'R2',
            icon: SpriteList.BROADSWORD,
        }
    }
}