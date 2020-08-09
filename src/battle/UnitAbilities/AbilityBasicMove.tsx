import BaseAbility, { AbilityTarget } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import ClientBattleMap from '../BattleMap/ClientBattleMap';

export default class AbilityBasicMove extends BaseAbility {
    playOutAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(clientBattleMap, unitManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.MOVEMENT, 1);
        unitManager.moveUnit(user, targets[0] as TileCoord, clientBattleMap);
    }

    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!clientBattleMap.isTileEmpty(targets[0] as TileCoord)) {
            return false;
        }

        if (unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap)) {
            return false;
        }
        
        return user.hasAbilityPoints(AbilityPointType.MOVEMENT, 1);
    }
}