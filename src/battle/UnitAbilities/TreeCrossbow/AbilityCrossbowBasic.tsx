import BaseAbility, {
  AbilityTarget,
  AbilityDisplayDetails,
  AbilityTargetRestrictions,
} from "../BaseAbility";
import BattleUnit from "../../BattleUnits/BattleUnit";
import { SpriteList } from "../../SpriteUtils";
import GameDataManager from "../../Managers/GameDataManager";
import UnitStepForwardBackAnimation from "../../Managers/Animations/UnitStepForwardBackAnimation";
import { BoltTypeToAbility } from "./CrossbowBoltTypeMap";
import { UnitResourceTypes } from "../../BattleUnits/UnitResources";
import { KennyIconName } from "../../../interface/KennyIcon/KennyIconConstants";

export default class AbilityCrossbowBasic extends BaseAbility {
  displayProps = {
    name: "Fire Crossbow",
    icon: "Bow" as KennyIconName,
    tempDisplayLetter: "A",
  };
  actionPointCost = 1;
  isBasic = true;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ enemyUnit: true, minRange: 1, maxRange: 4 }];
  }

  doesUnitHaveResourcesForAbility(unit: BattleUnit) {
    return (
      unit.hasResource(UnitResourceTypes.CROSSBOW_BOLTS, 1) &&
      super.doesUnitHaveResourcesForAbility(unit)
    );
  }

  spendResources(unit: BattleUnit) {
    super.spendResources(unit);
    unit.useResource(UnitResourceTypes.CROSSBOW_BOLTS, 1);
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
    const abilityMetadata = user.getResourceMetadata(
      UnitResourceTypes.CROSSBOW_BOLTS,
      -1
    );
    const targetUnit = targets[0] as BattleUnit;
    BoltTypeToAbility[
      abilityMetadata.crossbowBoltType
    ].playOutAbilityInstantEffects(
      gameDataManager,
      user,
      targets,
      doneCallback
    );
    gameDataManager.animationManager
      .addAnimation(
        new UnitStepForwardBackAnimation(user, targetUnit.tileCoord)
      )
      .addListener(UnitStepForwardBackAnimation.FIRST_PART_DONE, () => {
        BoltTypeToAbility[
          abilityMetadata.crossbowBoltType
        ].playOutAbilityDisplayEffects(
          gameDataManager,
          user,
          targets,
          doneCallback
        );
      })
      .whenDone(() => {
        doneCallback();
      });
  }
}
