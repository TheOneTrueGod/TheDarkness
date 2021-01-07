import AbilityBasicAttack from "../AbilityBasicAttack";
import BattleUnit from '../../BattleUnits/BattleUnit';
import { AbilityTarget, AbilityTargetRestrictions, AbilityDisplayDetails, getTileCoordFromAbilityTarget } from "../BaseAbility";
import GameDataManager from "../../Managers/GameDataManager";
import { TileCoord } from "../../BattleTypes";
import { SpriteList } from "../../SpriteUtils";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import { AbilityAoE, getUnitsInAoE, convertAoEToCoords, getRotatedTargetSquares } from "../AbilityHelpers";
import { getManhattenDistance } from "../../BattleHelpers";
import SpriteEffectAnimation, { SpriteEffectNames, SpriteEffects } from "../../Managers/Animations/SpriteEffectAnimation";

export default class AbilitySwordSlash extends AbilityBasicAttack {
    actionPointCost = 1;
    energyCost = 3;
    maxRange = 1;
    minRange = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ maxRange: this.maxRange, enemyUnitInAoE: true }];
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

    canUnitUseAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        const sourceCoord = unit.tileCoord;
        const targetCoord = getTileCoordFromAbilityTarget(targets[0]);
        const distance = getManhattenDistance(sourceCoord, targetCoord);

        if (distance > this.maxRange || distance < this.minRange) {
            return false;
        }
        
        return true;
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'Sw',
            icon: SpriteList.POSITION_MARKER,
        }
    }
}