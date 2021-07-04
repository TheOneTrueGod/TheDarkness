import { getManhattenDistance } from "../../BattleHelpers";
import BattleUnit from "../../BattleUnits/BattleUnit";
import GameDataManager from "../../Managers/GameDataManager";
import BaseAbility, { AbilityTarget, getTileCoordFromAbilityTarget } from "../BaseAbility";

export function isCriticalHit(user: BattleUnit, target: AbilityTarget, gameDataManager: GameDataManager) {
    return getManhattenDistance(user.tileCoord, getTileCoordFromAbilityTarget(target)) === 3;
}

export interface CrossbowBoltAbility {
    playOutAbilityInstantEffects(gameDataManager: GameDataManager, user: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function): void;
    playOutAbilityDisplayEffects(gameDataManager: GameDataManager, user: BattleUnit, targets: Array<AbilityTarget>, doneCallback: Function): void;
}

export enum CrossbowBoltTypes {
    NORMAL = 'normal',
    EXPLOSIVE = 'explosive',
}
