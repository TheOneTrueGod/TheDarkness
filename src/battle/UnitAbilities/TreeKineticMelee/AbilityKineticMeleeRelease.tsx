import BaseAbility, {
  AbilityTarget,
  AbilityDisplayDetails,
  AbilityTargetRestrictions,
  getTileCoordFromAbilityTarget,
} from "../BaseAbility";
import BattleUnit from "../../BattleUnits/BattleUnit";
import { UnitResourceTypes } from "../../BattleUnits/UnitResources";
import { SpriteList } from "../../SpriteUtils";
import GameDataManager from "../../Managers/GameDataManager";
import SpriteEffectAnimation, {
  SpriteEffects,
  SpriteEffectNames,
} from "../../Managers/Animations/SpriteEffectAnimation";
import { KennyIconName } from "../../../interface/KennyIcon/KennyIconConstants";

export default class AbilityKineticMeleeRelease extends BaseAbility {
  displayProps = {
    name: "Basic Attack",
    icon: "Sword" as KennyIconName,
    tempDisplayLetter: "KR",
  };
  energyCost = 5;
  damage = 2;

  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ minRange: 1, maxRange: 1 }];
  }

  doesUnitHaveResourcesForAbility(unit: BattleUnit) {
    return (
      unit.hasResource(UnitResourceTypes.KINETIC_ENERGY, this.energyCost) &&
      super.doesUnitHaveResourcesForAbility(unit)
    );
  }

  spendResources(unit: BattleUnit) {
    super.spendResources(unit);
    unit.useResource(UnitResourceTypes.KINETIC_ENERGY, this.energyCost);
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

    const unitSize = unit.getUnitSize();
    for (let xOff = -1; xOff < unitSize.x + 1; xOff += 1) {
      for (let yOff = -1; yOff < unitSize.y + 1; yOff += 1) {
        const xOnEdge = xOff === -1 || xOff === unitSize.x;
        const yOnEdge = yOff === -1 || yOff === unitSize.y;
        if (!xOnEdge && !yOnEdge) {
          continue;
        }

        const targetCoord = {
          x: unit.tileCoord.x + xOff,
          y: unit.tileCoord.y + yOff,
        };
        const targetUnit = gameDataManager.unitManager.getUnitAtTileCoord(
          targetCoord,
          gameDataManager.clientBattleMap
        );

        const damage = this.getDamage(unit, targetUnit, gameDataManager);

        if (targetUnit) {
          targetUnit.dealDamage(damage);
        }

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
            if (targetUnit) {
              targetUnit.dealDisplayDamage(damage);
            }
          })
          .whenDone(() => {
            doneCallback();
          });
      }
    }
  }

  canUnitUseAbility(
    gameDataManager: GameDataManager,
    unit: BattleUnit,
    targets: Array<AbilityTarget>
  ) {
    if (targets.length !== 1) {
      return false;
    }
    return true;
  }
}
