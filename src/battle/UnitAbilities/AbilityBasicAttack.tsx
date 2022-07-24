import BaseAbility, {
  AbilityTarget,
  AbilityDisplayDetails,
  AbilityTargetRestrictions,
  determineIfTargetIsBattleUnit,
} from "./BaseAbility";
import BattleUnit, { AbilityPointType } from "../BattleUnits/BattleUnit";
import { SpriteList } from "../SpriteUtils";
import GameDataManager from "../Managers/GameDataManager";
import UnitStepForwardBackAnimation from "../Managers/Animations/UnitStepForwardBackAnimation";
import SpriteEffectAnimation, {
  SpriteEffectNames,
  SpriteEffects,
} from "../Managers/Animations/SpriteEffectAnimation";
import { KennyIconName } from "../../interface/KennyIcon/KennyIconConstants";

export default class AbilityBasicAttack extends BaseAbility {
  displayProps = {
    name: "Basic Attack",
    icon: "Sword" as KennyIconName,
    tempDisplayLetter: "A",
  };
  actionPointCost = 1;
  damage = 1;
  isBasic = true;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ enemyUnit: true, minRange: 1, maxRange: 1 }];
  }

  playOutAbility(
    gameDataManager: GameDataManager,
    unit: BattleUnit,
    targets: Array<AbilityTarget>,
    doneCallback: Function
  ) {
    if (!this.canUnitUseAbility(gameDataManager, unit, targets)) {
      throw new Error(`Unit can't use ability: ${this.constructor.name}`);
    }
    const targetUnit = targets[0] as BattleUnit;
    targetUnit.dealDamage(this.damage);
    gameDataManager.animationManager
      .addAnimation(
        new UnitStepForwardBackAnimation(unit, targetUnit.tileCoord)
      )
      .addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
        targetUnit.dealDisplayDamage(this.damage);
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
