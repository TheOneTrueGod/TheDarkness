import UnitManager from "./UnitManager";
import { CurrentTurn } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import BattleMap from "../../../object_defs/Campaign/Mission/Battle/BattleMap";
import { getManhattenDistance, getShortestPath } from "../BattleHelpers";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";

export default {
    doAIActionsAtTurnStart(unitManager: UnitManager, currentTurn: CurrentTurn, battleMap: BattleMap, issueUnitOrder: Function) {
        const controlledUnits = unitManager.getUnitsControlledByTeams([currentTurn.team]);
        if (!controlledUnits) { return; }
        //const controlledUnits = unitManager.getUnitsControlledByTeams([currentTurn.team]);
        const enemyUnits = unitManager.getUnitsOnOppositeTeam(currentTurn.team);

        controlledUnits.forEach((unit: BattleUnit) => {
            const targetUnit = enemyUnits.reduce((targetUnit: BattleUnit, nextUnit: BattleUnit) => {
                if (!targetUnit) { return nextUnit; }

                const currentDist = getManhattenDistance(targetUnit.tileCoord, nextUnit.tileCoord);
                const nextDist = getManhattenDistance(unit.tileCoord, nextUnit.tileCoord);

                if (currentDist > nextDist) { return targetUnit; }
                return nextUnit;
            });

            const shortestPath = getShortestPath(unit.tileCoord, targetUnit.tileCoord, battleMap, unitManager);
            let i = 0;
            const moveAbility = unit.getBasicMoveAbility();
            while (
                i < shortestPath.length &&
                moveAbility.canUnitUseAbility(battleMap, unitManager, unit, [shortestPath[i]])
            ) {
                issueUnitOrder(new UnitOrder(
                    unit,
                    OrderType.USE_ABILITY,
                    [shortestPath[i]],
                    moveAbility
                ));
                i ++;
            }
        });
    }
};