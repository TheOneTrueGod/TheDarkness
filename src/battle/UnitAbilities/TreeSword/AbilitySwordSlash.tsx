import BattleUnit from "../../BattleUnits/BattleUnit";
import BaseAbility, {
  AbilityTarget,
  AbilityTargetRestrictions,
  AbilityDisplayDetails,
  getTileCoordFromAbilityTarget,
} from "../BaseAbility";
import GameDataManager from "../../Managers/GameDataManager";
import { SpriteList } from "../../SpriteUtils";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import {
  AbilityAoE,
  getUnitsInAoE,
  convertAoEToCoords,
  getRotatedTargetSquares,
} from "../AbilityHelpers";
import SpriteEffectAnimation, {
  SpriteEffectNames,
  SpriteEffects,
} from "../../Managers/Animations/SpriteEffectAnimation";
import { isCriticalHit } from "./SwordHelpers";
import { GameIconName } from "../../../interface/GameIcon/GameIconConstants";

export default class AbilitySwordSlash extends BaseAbility {
  displayProps = {
    name: "Sword Slash",
    icon: "Slash" as GameIconName,
  };
  actionPointCost = 1;
  energyCost = 3;
  damage = 1;
  criticalDamageBonus = 1;
  isCriticalHit = isCriticalHit;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ minRange: 1, maxRange: 1, enemyUnitInAoE: true }];
  }

  getAbilityAoE(): AbilityAoE {
    return {
      centerOffset: { x: 1, y: 1 },
      square: [0, 0, 0, 1, 1, 1, 0, 0, 0],
    };
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

    const sourceCoord = user.tileCoord;
    const targetCoord = getTileCoordFromAbilityTarget(targets[0]);
    const abilityAoE = this.getAbilityAoE();
    const targetUnits = getUnitsInAoE(
      sourceCoord,
      targetCoord,
      abilityAoE,
      gameDataManager
    );
    const damage = this.getDamage(user, targetCoord, gameDataManager);

    targetUnits.forEach((target: BattleUnit) => {
      target.dealDamage(damage);
    });
    gameDataManager.animationManager
      .addAnimation(new UnitStepForwardBackAnimation(user, targetCoord))
      .addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
        targetUnits.forEach((target: BattleUnit) => {
          target.dealDisplayDamage(damage);
        });
        const rotatedAoE = getRotatedTargetSquares(
          sourceCoord,
          targetCoord,
          abilityAoE
        );
        const targetCoords = convertAoEToCoords(targetCoord, rotatedAoE);
        targetCoords.forEach((effectCoord) => {
          gameDataManager.animationManager.addAnimation(
            new SpriteEffectAnimation(
              SpriteEffects[SpriteEffectNames.SwordSlashes],
              effectCoord,
              30,
              0,
              2
            )
          );
        });
      })
      .whenDone(() => {
        doneCallback();
      });
  }
}
