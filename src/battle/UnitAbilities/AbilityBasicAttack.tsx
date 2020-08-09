import BaseAbility, { AbilityTarget } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import { getManhattenDistance } from '../BattleHelpers';
import ClientBattleMap from '../BattleMap/ClientBattleMap';

export default class AbilityBasicAttack extends BaseAbility {
    playOutAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(clientBattleMap, unitManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.ACTION, 1);
        const targetUnit = unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap);
        targetUnit.dealDamage(1);
        //unitManager.moveUnit(user, targets[0] as TileCoord);
    }

    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap)) {
            return false;
        }

        if (getManhattenDistance(user.tileCoord, targets[0] as TileCoord) > 1) { return false; }
        
        return user.hasAbilityPoints(AbilityPointType.ACTION, 1);
    }
}