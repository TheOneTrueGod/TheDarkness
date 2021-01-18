import BattleUnit from "../../BattleUnits/BattleUnit";
import GameDataManager from "../../Managers/GameDataManager";
import { AbilityTarget } from "../BaseAbility";

export function isCriticalHit(user: BattleUnit, target: AbilityTarget, gameDataManager: GameDataManager) {
    const squaresWithAllies = [[-1, 0], [1, 0], [0, -1], [0, 1]].filter((offset) => {
        const queryCoord = { x: user.tileCoord.x + offset[0], y: user.tileCoord.y + offset[1] };
        const unitAtCoord = gameDataManager.unitManager.getUnitAtTileCoord(queryCoord, gameDataManager.clientBattleMap);
        if (unitAtCoord && unitAtCoord.isOnSameTeam(user.team)) {
            return true;
        };
        return false;
    });

    return squaresWithAllies.length > 0;
}