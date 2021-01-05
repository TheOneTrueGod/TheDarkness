import UnitManager from "./UnitManager";
import { CurrentTurn, TileCoord } from "../BattleTypes";
import BattleUnit from "../BattleUnits/BattleUnit";
import { getManhattenDistance, getShortestPath, arePositionsEqual, cloneCoord, isTileWalkable } from "../BattleHelpers";
import UnitOrder, { OrderType } from "../BattleUnits/UnitOrder";
import ClientBattleMap from "../BattleMap/ClientBattleMap";
import GameDataManager from "./GameDataManager";

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

function moveUnitToDesiredRange(unit: BattleUnit, target: TileCoord, range: number, gameDataManager: GameDataManager, issueUnitOrder: Function) {
    if (arePositionsEqual(unit.tileCoord, target)) {
        return;
    }
    
    const shortestPath = getShortestPath(unit.tileCoord, target, gameDataManager.clientBattleMap, gameDataManager.unitManager);

    unit.debugPathing.previousPosition = cloneCoord(unit.tileCoord);
    unit.debugPathing.path = shortestPath;
    unit.debugPathing.target = cloneCoord(target);

    let i = 0;
    const moveAbility = unit.getBasicMoveAbility();
    while (
        i < shortestPath.length &&
        moveAbility.isValidTarget(0, shortestPath[i], unit, gameDataManager) &&
        moveAbility.canUnitUseAbility(gameDataManager, unit, [shortestPath[i]]) &&
        moveAbility.doesUnitHaveResourcesForAbility(unit)
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

function useAttackAbilities(unit: BattleUnit, targetUnit: BattleUnit, gameDataManager: GameDataManager, issueUnitOrder: Function) {
    const attackAbility = unit.getBasicAttackAbility();
    let iterCount = 0;
    while (
        attackAbility.canUnitUseAbility(gameDataManager, unit, [targetUnit]) &&
        attackAbility.isValidTarget(0, targetUnit, unit, gameDataManager) &&
        attackAbility.doesUnitHaveResourcesForAbility(unit)
    ) {
        iterCount += 1;
        if (iterCount > 10) { throw new Error("useAttackAbilities iterated too many times") }
        issueUnitOrder(new UnitOrder(
            unit,
            OrderType.USE_ABILITY,
            [targetUnit],
            attackAbility
        ));
    }
}

export default {
    doAIActionsAtTurnStart(
        gameDataManager: GameDataManager,
        currentTurn: CurrentTurn,
        issueUnitOrder: Function,
    ) {
        const controlledUnits = gameDataManager.unitManager.getUnitsControlledByTeams(
            [currentTurn.team],
            (unit: BattleUnit) => unit.owner === currentTurn.owner,
        );
        if (!controlledUnits) { return; }
        
        const enemyUnits = gameDataManager.unitManager.getUnitsOnOppositeTeam(currentTurn.team);

        controlledUnits.forEach((unit: BattleUnit) => {
            const targetUnit = findTargetForUnit(unit, enemyUnits, gameDataManager.unitManager, gameDataManager.clientBattleMap);
            if (!targetUnit) { return }
            moveUnitToDesiredRange(unit, targetUnit.tileCoord, 1, gameDataManager, issueUnitOrder);
            useAttackAbilities(unit, targetUnit, gameDataManager, issueUnitOrder);
        });
    }
};