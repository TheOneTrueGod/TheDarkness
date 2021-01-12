import BattleUnit from '../../BattleUnits/BattleUnit';
import BaseAbility, { AbilityTarget, AbilityTargetRestrictions, AbilityDisplayDetails, getTileCoordFromAbilityTarget } from "../BaseAbility";
import GameDataManager from "../../Managers/GameDataManager";
import { SpriteList } from "../../SpriteUtils";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import { AbilityAoE, getUnitsInAoE, convertAoEToCoords, getRotatedTargetSquares } from "../AbilityHelpers";
import SpriteEffectAnimation, { SpriteEffectNames, SpriteEffects } from "../../Managers/Animations/SpriteEffectAnimation";

export default class AbilitySwordSlash extends BaseAbility {
    actionPointCost = 1;
    energyCost = 3;
    damage = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ minRange: 1, maxRange: 1, enemyUnitInAoE: true }];
    }

    getAbilityAoE(): AbilityAoE {
        return {
            centerOffset: { x: 1, y: 1 },
            square: [
                0, 0, 0,
                1, 1, 1,
                0, 0, 0,
            ],
        }
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }

        const sourceCoord = unit.tileCoord;
        const targetCoord = getTileCoordFromAbilityTarget(targets[0]);
        const abilityAoE = this.getAbilityAoE();
        const targetUnits = getUnitsInAoE(sourceCoord, targetCoord, abilityAoE, gameDataManager);
        
        targetUnits.forEach((unit: BattleUnit) => { unit.dealDamage(this.damage) });
        gameDataManager.animationManager.addAnimation(
            new UnitStepForwardBackAnimation(unit, targetCoord)
        ).addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
            targetUnits.forEach((unit: BattleUnit) => { unit.dealDisplayDamage(this.damage) });
            const rotatedAoE = getRotatedTargetSquares(sourceCoord, targetCoord, abilityAoE);
            const targetCoords = convertAoEToCoords(targetCoord, rotatedAoE);
            targetCoords.forEach((effectCoord) => {
                gameDataManager.animationManager.addAnimation(
                    new SpriteEffectAnimation(SpriteEffects[SpriteEffectNames.SwordSlashes], effectCoord, 30, 0, 2)
                );
            })
            
        })
        .whenDone(() => {
            doneCallback();
        });
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'Sw',
            icon: SpriteList.POSITION_MARKER,
        }
    }
}