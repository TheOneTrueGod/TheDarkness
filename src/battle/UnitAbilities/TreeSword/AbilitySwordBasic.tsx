import BaseAbility, {
  AbilityTarget,
  AbilityDisplayDetails,
  AbilityTargetRestrictions,
} from "../BaseAbility";
import BattleUnit from "../../BattleUnits/BattleUnit";
import { SpriteList } from "../../SpriteUtils";
import GameDataManager from "../../Managers/GameDataManager";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import SpriteEffectAnimation, {
  SpriteEffectNames,
  SpriteEffects,
} from "../../Managers/Animations/SpriteEffectAnimation";
import { isCriticalHit } from "./SwordHelpers";
import { GameIconName } from "../../../interface/GameIcon/GameIconConstants";

export default class AbilitySwordBasic extends BaseAbility {
  displayProps = {
    name: "Sword Strike",
    icon: "Sword" as GameIconName,
  };
  actionPointCost = 1;
  damage = 1;
  criticalDamageBonus = 1;
  isCriticalHit = isCriticalHit;
  isBasic = true;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ enemyUnit: true, minRange: 1, maxRange: 1 }];
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
    const targetUnit = targets[0] as BattleUnit;
    const damage = this.getDamage(user, targetUnit, gameDataManager);
    targetUnit.dealDamage(damage);
    gameDataManager.animationManager
      .addAnimation(
        new UnitStepForwardBackAnimation(user, targetUnit.tileCoord)
      )
      .addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
        targetUnit.dealDisplayDamage(damage);
        gameDataManager.animationManager.addAnimation(
          new SpriteEffectAnimation(
            SpriteEffects[SpriteEffectNames.SwordSlashes],
            targetUnit.tileCoord,
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
}
