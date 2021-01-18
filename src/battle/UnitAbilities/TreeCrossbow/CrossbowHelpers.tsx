import { getManhattenDistance } from "../../BattleHelpers";
import BattleUnit from "../../BattleUnits/BattleUnit";
import GameDataManager from "../../Managers/GameDataManager";
import { AbilityTarget, getTileCoordFromAbilityTarget } from "../BaseAbility";

export function isCriticalHit(user: BattleUnit, target: AbilityTarget, gameDataManager: GameDataManager) {
    return getManhattenDistance(user.tileCoord, getTileCoordFromAbilityTarget(target)) === 3;
}

export enum CrossbowBoltTypes {
    NORMAL = 'normal',
    EXPLOSIVE = 'explosive',
}
