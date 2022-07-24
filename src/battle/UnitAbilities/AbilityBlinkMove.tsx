import BaseAbility, {
  AbilityTarget,
  AbilityTargetRestrictions,
  getTileCoordFromAbilityTarget,
} from "./BaseAbility";
import BattleUnit from "../BattleUnits/BattleUnit";
import { UnitResourceTypes } from "../BattleUnits/UnitResources";
import { tileCoordToPosition } from "../BattleHelpers";
import GameDataManager from "../Managers/GameDataManager";
import SpriteEffectAnimation, {
  SpriteEffects,
  SpriteEffectNames,
} from "../Managers/Animations/SpriteEffectAnimation";
import { GameIconName } from "../../interface/GameIcon/GameIconConstants";

export default class AbilityBlinkMove extends BaseAbility {
  displayProps = {
    name: "Blink",
    icon: "Teleport" as GameIconName,
  };
  energyCost = 3;
  movePointCost = 1;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ emptyTile: true, minRange: 1, maxRange: 3 }];
  }

  doesUnitHaveResourcesForAbility(unit: BattleUnit) {
    return (
      unit.hasResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost) &&
      super.doesUnitHaveResourcesForAbility(unit)
    );
  }

  spendResources(unit: BattleUnit) {
    super.spendResources(unit);
    unit.useResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost);
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
    const targetCoord = getTileCoordFromAbilityTarget(targets[0]);
    const startCoord = unit.tileCoord;
    gameDataManager.unitManager.moveUnit(
      unit,
      targetCoord,
      gameDataManager.clientBattleMap
    );

    // animation
    unit.setSpriteOffset(
      tileCoordToPosition({
        x: startCoord.x - targetCoord.x,
        y: startCoord.y - targetCoord.y,
      })
    );
    gameDataManager.animationManager
      .addAnimation(
        new SpriteEffectAnimation(
          SpriteEffects[SpriteEffectNames.BlueExplosion],
          startCoord,
          20,
          0
        )
      )
      .whenHalfDone(() => {
        unit.setVisible(false);
        unit.setSpriteOffset({ x: 0, y: 0 });
        gameDataManager.animationManager
          .addAnimation(
            new SpriteEffectAnimation(
              SpriteEffects[SpriteEffectNames.BlueExplosion],
              targetCoord,
              20,
              0
            )
          )
          .whenHalfDone(() => {
            unit.setVisible(true);
          })
          .whenDone(() => {
            doneCallback();
          });
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

    if (
      !gameDataManager.clientBattleMap.canUnitMoveIntoTile(
        unit,
        target,
        gameDataManager
      )
    ) {
      return false;
    }

    return true;
  }
}
