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

function getMoveTargetTile(source: TileCoord, target: TileCoord, gameDataManager: GameDataManager): TileCoord {
    const deltaTarget = { x: target.x - source.x, y: target.y - source.y };
    const moveTargetTile = { x: source.x + deltaTarget.x, y: source.y + deltaTarget.y };

    return moveTargetTile;
}

function customTargetValidation(user: BattleUnit, source: TileCoord, target: AbilityTarget, gameDataManager: GameDataManager) {
    const moveTargetTile = getMoveTargetTile(user.tileCoord, getTileCoordFromAbilityTarget(target), gameDataManager);
    if (!gameDataManager.clientBattleMap.canUnitMoveIntoTile(user, moveTargetTile, gameDataManager)) {
        return false;
    }
    return true;
}

export default class AbilitySwordStrikethrough extends AbilityBasicAttack {
    actionPointCost = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ 
            minRange: 1,
            maxRange: 1,
            enemyUnit: true,
            customFunction: customTargetValidation
        }];
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

        const target = getTileCoordFromAbilityTarget(targets[0]);

        if (!gameDataManager.clientBattleMap.canUnitMoveIntoTile(unit, target, gameDataManager)) {
            return false;
        }
        
        return true;
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'St',
            icon: SpriteList.POSITION_MARKER,
        }
    }
}