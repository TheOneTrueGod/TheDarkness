import { SpriteList } from "../SpriteUtils"
import BaseAbility from "../UnitAbilities/BaseAbility"
import AbilityMap from "../UnitAbilities/AbilityMap"

export type UnitDef = {
    image: SpriteList;
    health: number;
    movementPoints: number;
    actionPoints: number;
    size: { x: number, y: number };
    abilities: Array<BaseAbility>;
}

export const TempPlayerUnitDef: UnitDef = {
    image: SpriteList.BROADSWORD,
    health: 8,
    movementPoints: 2,
    actionPoints: 2,
    size: { x: 1, y: 1 },
    abilities: [AbilityMap.BasicMove, AbilityMap.BasicAttack, AbilityMap.BlinkMove, AbilityMap.SwordSlash, AbilityMap.SwordStrikethrough],
}

export const CaravanUnitDef: UnitDef = {
    image: SpriteList.CARAVAN,
    health: 1,
    movementPoints: 0,
    actionPoints: 0,
    size: { x: 2, y: 2 },
    abilities: [],
}

export const EnemyWolfUnitDef: UnitDef = {
    image: SpriteList.ENEMY_WOLF,
    health: 4,
    movementPoints: 2,
    actionPoints: 1,
    size: { x: 1, y: 1 },
    abilities: [AbilityMap.BasicMove, AbilityMap.BasicAttack],
}