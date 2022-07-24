import BattleUnit from "../../BattleUnits/BattleUnit";
import BaseAbility, {
  AbilityTarget,
  AbilityTargetRestrictions,
  AbilityDisplayDetails,
  getTileCoordFromAbilityTarget,
  determineIfTargetIsBattleUnit,
} from "../BaseAbility";
import GameDataManager from "../../Managers/GameDataManager";
import { TileCoord } from "../../BattleTypes";
import { SpriteList } from "../../SpriteUtils";
import SpriteEffectAnimation, {
  SpriteEffectNames,
  SpriteEffects,
} from "../../Managers/Animations/SpriteEffectAnimation";
import UnitMoveAnimation from "../../Managers/Animations/UnitMoveAnimation";
import { isCriticalHit } from "./SwordHelpers";
import { GameIconName } from "../../../interface/GameIcon/GameIconConstants";

function getMoveTargetTile(
  source: TileCoord,
  target: TileCoord,
  gameDataManager: GameDataManager
): TileCoord {
  const deltaTarget = { x: target.x - source.x, y: target.y - source.y };
  const moveTargetTile = {
    x: source.x + deltaTarget.x * 2,
    y: source.y + deltaTarget.y * 2,
  };

  return moveTargetTile;
}

function customTargetValidation(
  user: BattleUnit,
  source: TileCoord,
  target: AbilityTarget,
  gameDataManager: GameDataManager
) {
  const moveTargetTile = getMoveTargetTile(
    user.tileCoord,
    getTileCoordFromAbilityTarget(target),
    gameDataManager
  );
  if (
    !gameDataManager.clientBattleMap.canUnitMoveIntoTile(
      user,
      moveTargetTile,
      gameDataManager
    )
  ) {
    return false;
  }
  return true;
}

export default class AbilitySwordStrikethrough extends BaseAbility {
  displayProps = {
    name: "Strikethrough",
    icon: "SwordDash" as GameIconName,
  };
  actionPointCost = 1;
  movePointCost = 1;
  damage = 1;
  criticalDamageBonus = 1;
  isCriticalHit = isCriticalHit;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [
      {
        minRange: 1,
        maxRange: 1,
        customFunction: customTargetValidation,
      },
    ];
  }

  playOutAbility(
    gameDataManager: GameDataManager,
    user: BattleUnit,
    targets: Array<AbilityTarget>,
    doneCallback: Function
  ) {
    if (!this.canUnitUseAbility(gameDataManager, user, targets)) {
      throw new Error(`Unit can't use ability: ${this.constructor.name}`);
    }

    const targetUnit = determineIfTargetIsBattleUnit(targets[0])
      ? (targets[0] as BattleUnit)
      : undefined;
    const damage = this.getDamage(user, targetUnit, gameDataManager);
    targetUnit && targetUnit.dealDamage(this.damage);
    const targetPos = getTileCoordFromAbilityTarget(targets[0]);
    const moveTarget = getMoveTargetTile(
      user.tileCoord,
      targetPos,
      gameDataManager
    );
    const previousCoord = user.tileCoord;
    gameDataManager.unitManager.moveUnit(
      user,
      moveTarget,
      gameDataManager.clientBattleMap
    );
    gameDataManager.animationManager
      .addAnimation(new UnitMoveAnimation(user, previousCoord))
      .whenHalfDone(() => {
        if (targetUnit) {
          targetUnit.dealDisplayDamage(damage);
        }
        gameDataManager.animationManager.addAnimation(
          new SpriteEffectAnimation(
            SpriteEffects[SpriteEffectNames.SwordSlashes],
            targetPos,
            30,
            0,
            2
          )
        );
      })
      .whenDone(() => {
        doneCallback();
      });
  }

  canUnitUseAbility(
    gameDataManager: GameDataManager,
    unit: BattleUnit,
    targets: Array<AbilityTarget>
  ) {
    if (targets.length !== 1) {
      return false;
    }

    const target = getTileCoordFromAbilityTarget(targets[0]);
    const moveTargetTile = getMoveTargetTile(
      unit.tileCoord,
      getTileCoordFromAbilityTarget(target),
      gameDataManager
    );
    if (
      !gameDataManager.clientBattleMap.canUnitMoveIntoTile(
        unit,
        moveTargetTile,
        gameDataManager
      )
    ) {
      return false;
    }

    return true;
  }
}
