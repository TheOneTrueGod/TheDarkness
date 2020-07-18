import BaseAbility, { AbilityTarget } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';

export default class AbilityBasicMove extends BaseAbility {
    playOutAbility(unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.MOVEMENT, 1);
        unitManager.moveUnit(user, targets[0] as TileCoord);
    }

    canUnitUseAbility(user: BattleUnit, targets: Array<AbilityTarget>) {
        return user.hasAbilityPoints(AbilityPointType.MOVEMENT, 1);
    }
}