import BattleUnit from '../../BattleUnits/BattleUnit';
import BaseAbility, { AbilityTarget, AbilityTargetRestrictions, AbilityDisplayDetails, getTileCoordFromAbilityTarget, determineIfTargetIsBattleUnit } from "../BaseAbility";
import GameDataManager from "../../Managers/GameDataManager";
import { TileCoord } from "../../BattleTypes";
import { SpriteList } from "../../SpriteUtils";
import SpriteEffectAnimation, { SpriteEffectNames, SpriteEffects } from "../../Managers/Animations/SpriteEffectAnimation";
import UnitMoveAnimation from "../../Managers/Animations/UnitMoveAnimation";

function getMoveTargetTile(source: TileCoord, target: TileCoord, gameDataManager: GameDataManager): TileCoord {
    const deltaTarget = { x: target.x - source.x, y: target.y - source.y };
    const moveTargetTile = { x: source.x + deltaTarget.x * 2, y: source.y + deltaTarget.y * 2 };

    return moveTargetTile;
}

function customTargetValidation(user: BattleUnit, source: TileCoord, target: AbilityTarget, gameDataManager: GameDataManager) {
    const moveTargetTile = getMoveTargetTile(user.tileCoord, getTileCoordFromAbilityTarget(target), gameDataManager);
    if (!gameDataManager.clientBattleMap.canUnitMoveIntoTile(user, moveTargetTile, gameDataManager)) {
        return false;
    }
    return true;
}

export default class AbilitySwordStrikethrough extends BaseAbility {
    actionPointCost = 1;
    movementPointCost = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ 
            minRange: 1,
            maxRange: 1,
            customFunction: customTargetValidation
        }];
    }

    playOutAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function) {
        if (!this.canUnitUseAbility(gameDataManager, unit, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }

        const targetUnit = determineIfTargetIsBattleUnit(targets[0]) ? targets[0] as BattleUnit : undefined;
        targetUnit && targetUnit.dealDamage(this.damage);

        const targetPos = getTileCoordFromAbilityTarget(targets[0]);
        const moveTarget = getMoveTargetTile(unit.tileCoord, targetPos, gameDataManager);
        const previousCoord = unit.tileCoord;
        gameDataManager.unitManager.moveUnit(unit, moveTarget, gameDataManager.clientBattleMap);
        gameDataManager.animationManager.addAnimation(
            new UnitMoveAnimation(unit, previousCoord)
        ).whenHalfDone(() => {
            if (targetUnit) {
                targetUnit.dealDisplayDamage(this.damage);
            }
            gameDataManager.animationManager.addAnimation(
                new SpriteEffectAnimation(SpriteEffects[SpriteEffectNames.SwordSlashes], targetPos, 30, 0, 2)
            );
        }).whenDone(() => {
            doneCallback();
        });
    }

    canUnitUseAbility(gameDataManager: GameDataManager, unit: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        const target = getTileCoordFromAbilityTarget(targets[0]);
        const moveTargetTile = getMoveTargetTile(unit.tileCoord, getTileCoordFromAbilityTarget(target), gameDataManager);
        if (!gameDataManager.clientBattleMap.canUnitMoveIntoTile(unit, moveTargetTile, gameDataManager)) {
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