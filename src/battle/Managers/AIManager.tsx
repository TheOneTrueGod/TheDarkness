import UnitManager from "./UnitManager";
import { CurrentTurn, TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import { getManhattenDistance, getShortestPath, arePositionsEqual, cloneCoord, isTileWalkable } from "../BattleHelpers";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";
import ClientBattleMap from "../BattleMap/ClientBattleMap";

function isAbleToAttack(actingUnit: BattleUnit, targetUnit: BattleUnit, unitManager: UnitManager, clientBattleMap: ClientBattleMap) {
    if (getManhattenDistance(actingUnit.tileCoord, targetUnit.tileCoord) <= 1) { return true; }

    const canMoveBeside = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([offsetX, offsetY]) => {
        if (isTileWalkable(
            { x: targetUnit.tileCoord.x + offsetX, y: targetUnit.tileCoord.y + offsetY },
            unitManager, 
            clientBattleMap)) {
            return true;
        }
        return false;
    });
    
    return canMoveBeside;
}

function findTargetForUnit(actingUnit: BattleUnit, enemyUnits: Array<BattleUnit>, unitManager: UnitManager, clientBattleMap: ClientBattleMap): BattleUnit | null {
    return enemyUnits.reduce((targetUnit: BattleUnit, nextUnit: BattleUnit) => {
        if (!targetUnit) { return nextUnit; }
        if (!isAbleToAttack(actingUnit, nextUnit, unitManager, clientBattleMap)) { return targetUnit; }
        
        const currentDist = getManhattenDistance(actingUnit.tileCoord, targetUnit.tileCoord);
        const nextDist = getManhattenDistance(actingUnit.tileCoord, nextUnit.tileCoord);
        if (currentDist < nextDist) { return targetUnit; }
        return nextUnit;
    }, null);
}

function moveUnitToDesiredRange(unit: BattleUnit, target: TileCoord, range: number, clientBattleMap: ClientBattleMap, unitManager: UnitManager, issueUnitOrder: Function) {
    if (arePositionsEqual(unit.tileCoord, target)) {
        return;
    }
    
    const shortestPath = getShortestPath(unit.tileCoord, target, clientBattleMap, unitManager);

    unit.debugPathing.previousPosition = cloneCoord(unit.tileCoord);
    unit.debugPathing.path = shortestPath;
    unit.debugPathing.target = cloneCoord(target);

    let i = 0;
    const moveAbility = unit.getBasicMoveAbility();
    while (
        i < shortestPath.length &&
        moveAbility.canUnitUseAbility(clientBattleMap, unitManager, unit, [shortestPath[i]])
    ) {
        issueUnitOrder(new UnitOrder(
            unit,
            OrderType.USE_ABILITY,
            [shortestPath[i]],
            moveAbility
        ));
        i ++;
    }
}

function useAttackAbilities(unit: BattleUnit, targetUnit: BattleUnit, clientBattleMap: ClientBattleMap, unitManager: UnitManager, issueUnitOrder: Function) {
    const attackAbility = unit.getBasicAttackAbility();
    while (attackAbility.canUnitUseAbility(clientBattleMap, unitManager, unit, [targetUnit.tileCoord])) {
        issueUnitOrder(new UnitOrder(
            unit,
            OrderType.USE_ABILITY,
            [targetUnit.tileCoord],
            attackAbility
        ));
    }
}

export default {
    doAIActionsAtTurnStart(unitManager: UnitManager, currentTurn: CurrentTurn, clientBattleMap: ClientBattleMap, issueUnitOrder: Function) {
        const controlledUnits = unitManager.getUnitsControlledByTeams(
            [currentTurn.team],
            (unit: BattleUnit) => unit.owner === currentTurn.owner,
        );
        if (!controlledUnits) { return; }
        
        const enemyUnits = unitManager.getUnitsOnOppositeTeam(currentTurn.team);

        controlledUnits.forEach((unit: BattleUnit) => {
            const targetUnit = findTargetForUnit(unit, enemyUnits, unitManager, clientBattleMap);
            if (!targetUnit) { return }
            moveUnitToDesiredRange(unit, targetUnit.tileCoord, 1, clientBattleMap, unitManager, issueUnitOrder);
            useAttackAbilities(unit, targetUnit, clientBattleMap, unitManager, issueUnitOrder);
        });
    }
};