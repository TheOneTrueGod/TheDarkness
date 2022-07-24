import BaseAbility, {
  AbilityTarget,
  AbilityDisplayDetails,
  AbilityTargetRestrictions,
} from "../BaseAbility";
import BattleUnit from "../../BattleUnits/BattleUnit";
import { SpriteList } from "../../SpriteUtils";
import GameDataManager from "../../Managers/GameDataManager";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import {
  CrossbowBoltAbility,
  CrossbowBoltTypes,
  isCriticalHit,
} from "./CrossbowHelpers";
import { UnitResourceTypes } from "../../BattleUnits/UnitResources";
import SpriteEffectAnimation, {
  SpriteEffectNames,
  SpriteEffects,
} from "../../Managers/Animations/SpriteEffectAnimation";
import { KennyIconName } from "../../../interface/KennyIcon/KennyIconConstants";

export default class AbilityCrossbowReload
  extends BaseAbility
  implements CrossbowBoltAbility
{
  displayProps = {
    name: "Reload",
    icon: "Bow" as KennyIconName,
    tempDisplayLetter: "R",
  };
  actionPointCost = 1;
  movePointCost = 1;
  damage = 1;
  criticalDamageBonus = 1;
  isCriticalHit = isCriticalHit;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ minRange: 0, maxRange: 0 }];
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
    const resource = user.getResource(UnitResourceTypes.CROSSBOW_BOLTS);
    const amountToGain = resource.max - resource.current;
    user.gainResource(UnitResourceTypes.CROSSBOW_BOLTS, amountToGain, {
      crossbowBoltType: CrossbowBoltTypes.NORMAL,
    });
    gameDataManager.animationManager
      .addAnimation(
        new UnitStepForwardBackAnimation(user, {
          x: user.tileCoord.x - 1,
          y: user.tileCoord.y,
        })
      )
      .addListener(UnitStepForwardBackAnimation.ANIMATION_EVENT_DONE, () => {
        user.gainDisplayResource(
          UnitResourceTypes.CROSSBOW_BOLTS,
          amountToGain
        );

        gameDataManager.animationManager
          .addAnimation(
            new UnitStepForwardBackAnimation(user, {
              x: user.tileCoord.x + 1,
              y: user.tileCoord.y,
            })
          )
          .whenDone(() => {
            doneCallback();
          });
      });
  }

  playOutAbilityInstantEffects(
    gameDataManager: GameDataManager,
    user: BattleUnit,
    targets: Array<AbilityTarget>,
    doneCallback: Function
  ) {
    const targetUnit = targets[0] as BattleUnit;
    const damage = this.getDamage(user, targetUnit, gameDataManager);
    targetUnit.dealDamage(damage);
  }

  playOutAbilityDisplayEffects(
    gameDataManager: GameDataManager,
    user: BattleUnit,
    targets: Array<AbilityTarget>,
    doneCallback: Function
  ) {
    const targetUnit = targets[0] as BattleUnit;
    const damage = this.getDamage(user, targetUnit, gameDataManager);
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
  }
}
