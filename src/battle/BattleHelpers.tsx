import BattleUnit from './BattleUnits/BattleUnit';
import { UnitOwner } from './BattleTypes';

export function getCurrentTurn(
    initiativeNumber: number,
    unitList: Array<BattleUnit>
): UnitOwner {
    return unitList[1].owner;
}