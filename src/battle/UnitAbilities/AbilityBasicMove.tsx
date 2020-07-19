import BaseAbility, { AbilityTarget } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import BattleMap from '../../../object_defs/Campaign/Mission/Battle/BattleMap';

import BattleMapHelpers from '../../../object_defs/Campaign/Mission/Battle/BattleMapHelpers';

export default class AbilityBasicMove extends BaseAbility {
    playOutAbility(battleMap: BattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(battleMap, unitManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.MOVEMENT, 1);
        unitManager.moveUnit(user, targets[0] as TileCoord);
    }

    canUnitUseAbility(battleMap: BattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!BattleMapHelpers.isTileEmpty(battleMap, targets[0] as TileCoord)) {
            return false;
        }

        if (unitManager.getUnitAtTileCoord(targets[0] as TileCoord)) {
            return false;
        }
        
        return user.hasAbilityPoints(AbilityPointType.MOVEMENT, 1);
    }
}