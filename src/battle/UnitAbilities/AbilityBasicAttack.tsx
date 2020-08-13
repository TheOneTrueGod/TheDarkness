import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetTypes, AbilityTargetRestrictions } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import { getManhattenDistance } from '../BattleHelpers';
import ClientBattleMap from '../BattleMap/ClientBattleMap';
import { SpriteList } from '../SpriteUtils';

export default class AbilityBasicAttack extends BaseAbility {
    minRange = 1;
    maxRange = 1;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ enemyUnit: true, maxRange: this.maxRange }];
    }

    playOutAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(clientBattleMap, unitManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.ACTION, 1);
        const targetUnit = unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap);
        targetUnit.dealDamage(1);
        //unitManager.moveUnit(user, targets[0] as TileCoord);
    }

    doesUnitHaveResourcesForAbility(user: BattleUnit) {
        return user.hasAbilityPoints(AbilityPointType.ACTION, 1);
    }

    canUnitUseAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (targets.length !== 1) {
            return false;
        }

        if (!unitManager.getUnitAtTileCoord(targets[0] as TileCoord, clientBattleMap)) {
            return false;
        }

        if (getManhattenDistance(user.tileCoord, targets[0] as TileCoord) > this.maxRange) { return false; }
        
        return this.doesUnitHaveResourcesForAbility(user);
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'A',
            icon: SpriteList.BROADSWORD,
        }
    }
}