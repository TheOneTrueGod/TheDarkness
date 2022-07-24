import BaseAbility, {
  AbilityTarget,
  AbilityTargetRestrictions,
  getTileCoordFromAbilityTarget,
} from "./BaseAbility";
import BattleUnit from "../BattleUnits/BattleUnit";
import GameDataManager from "../Managers/GameDataManager";
import UnitMoveAnimation from "../Managers/Animations/UnitMoveAnimation";
import { GameIconName } from "../../interface/GameIcon/GameIconConstants";

export default class AbilityBasicMove extends BaseAbility {
  displayProps = {
    name: "Move",
    icon: "Move" as GameIconName,
  };
  movePointCost = 1;
  getTargetRestrictions(): Array<AbilityTargetRestrictions> {
    return [{ emptyTile: true, minRange: 1, maxRange: 1 }];
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
    const targetPos = getTileCoordFromAbilityTarget(targets[0]);
    const previousCoord = unit.tileCoord;
    gameDataManager.unitManager.moveUnit(
      unit,
      targetPos,
      gameDataManager.clientBattleMap
    );
    gameDataManager.animationManager
      .addAnimation(new UnitMoveAnimation(unit, previousCoord))
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
