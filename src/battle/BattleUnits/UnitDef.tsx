import { SpriteList } from "../SpriteUtils"
import BaseAbility from "../UnitAbilities/BaseAbility"
import AbilityMap from "../UnitAbilities/AbilityMap"
import { UnitResourceTypes } from "./UnitResources"

export type UnitDef = {
    image: SpriteList;
    health: number;
    movementPoints: number;
    actionPoints: number;
    size: { x: number, y: number };
    abilities: Array<BaseAbility>;
    resources: Array<UnitResourceTypes>;
}

export const SwordPlayerUnitDef: UnitDef = {
    image: SpriteList.BROADSWORD,
    health: 8,
    movementPoints: 2,
    actionPoints: 2,
    size: { x: 1, y: 1 },
    abilities: [AbilityMap.BasicMove, AbilityMap.SwordBasic, AbilityMap.BlinkMove, AbilityMap.SwordSlash, AbilityMap.SwordStrikethrough],
    resources: [UnitResourceTypes.BLINK_ENERGY],
}

export const CrossbowPlayerUnitDef: UnitDef = {
    image: SpriteList.CROSSBOW,
    health: 8,
    movementPoints: 2,
    actionPoints: 2,
    size: { x: 1, y: 1 },
    abilities: [AbilityMap.BasicMove, AbilityMap.CrossbowBasic, AbilityMap.CrossbowReload],
    resources: [UnitResourceTypes.CROSSBOW_BOLTS],
}

export const CaravanUnitDef: UnitDef = {
    image: SpriteList.CARAVAN,
    health: 1,
    movementPoints: 0,
    actionPoints: 0,
    size: { x: 2, y: 2 },
    abilities: [],
    resources: [],
}

export const EnemyWolfUnitDef: UnitDef = {
    image: SpriteList.ENEMY_WOLF,
    health: 6,
    movementPoints: 2,
    actionPoints: 1,
    size: { x: 1, y: 1 },
    abilities: [AbilityMap.BasicMove, AbilityMap.BasicAttack],
    resources: [],
}