import BaseAbility, { AbilityTarget, AbilityDisplayDetails, AbilityTargetTypes, AbilityTargetRestrictions } from './BaseAbility';
import BattleUnit, { AbilityPointType } from '../BattleUnits/BattleUnit';
import UnitManager from '../Managers/UnitManager';
import { TileCoord } from '../BattleTypes';
import ClientBattleMap from '../BattleMap/ClientBattleMap';
import { UnitResourceTypes } from '../BattleUnits/UnitResources';
import { getManhattenDistance } from '../BattleHelpers';
import { SpriteList } from '../SpriteUtils';

export default class AbilityBlinkMove extends BaseAbility {
    energyCost = 3;
    movementPointCost = 1;
    maxRange = 3;
    getTargetRestrictions(): Array<AbilityTargetRestrictions> {
        return [{ emptyTile: true, maxRange: this.maxRange }];
    }

    playOutAbility(clientBattleMap: ClientBattleMap, unitManager: UnitManager, user: BattleUnit, targets: Array<AbilityTarget>) {
        if (!this.canUnitUseAbility(clientBattleMap, unitManager, user, targets)) {
            throw new Error(`Unit can't use ability: ${this.constructor.name}`)
        }
        user.useAbilityPoints(AbilityPointType.MOVEMENT, this.movementPointCost);
        user.useResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost);
        unitManager.moveUnit(user, targets[0] as TileCoord, clientBattleMap);
    }

    doesUnitHaveResourcesForAbility(user: BattleUnit) {
        return user.hasAbilityPoints(AbilityPointType.MOVEMENT, this.movementPointCost) && 
            user.hasResource(UnitResourceTypes.BLINK_ENERGY, this.energyCost);
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

        if (getManhattenDistance(user.tileCoord, targets[0] as TileCoord) > this.maxRange) {
            return false;
        }
        
        return this.doesUnitHaveResourcesForAbility(user);
    }

    getDisplayDetails(): AbilityDisplayDetails {
        return {
            tempDisplayLetter: 'Bl',
            icon: SpriteList.POSITION_MARKER,
        }
    }
}