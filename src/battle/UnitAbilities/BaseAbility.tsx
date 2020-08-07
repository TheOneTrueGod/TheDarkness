import { TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import UnitManager from "../Managers/UnitManager";
import ClientBattleMap from "../BattleMap/ClientBattleMap";

interface AbilityInterface {
    playOutAbility: Function;
    getTargets: Function;
    canUnitUseAbility: Function;
}

export type AbilityTarget = TileCoord | BattleUnit;

export default abstract class BaseAbility implements AbilityInterface {
    playOutAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {}
    getTargets() {}
    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) { return false; }
}