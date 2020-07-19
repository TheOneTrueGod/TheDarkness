import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import UnitManager from "../Managers/UnitManager";
import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";

interface AbilityInterface {
    playOutAbility: Function;
    getTargets: Function;
    canUnitUseAbility: Function;
}

export type AbilityTarget = TileCoord | BattleUnit;

export default abstract class BaseAbility implements AbilityInterface {
    playOutAbility(battleMap: BattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {}
    getTargets() {}
    canUnitUseAbility(battleMap: BattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) { return false; }
}