import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import UnitManager from "../Managers/UnitManager";

interface AbilityInterface {
    playOutAbility: Function;
    getTargets: Function;
    canUnitUseAbility: Function;
}

export type AbilityTarget = TileCoord | BattleUnit;

export default abstract class BaseAbility implements AbilityInterface {
    playOutAbility(unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {}
    getTargets() {}
    canUnitUseAbility(user: BattleUnit, targets: Array<AbilityTarget>) { return false; }
}