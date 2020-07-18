import { SpriteList } from "../SpriteUtils"

export type UnitDef = {
    image: SpriteList;
    health: number;
    movementPoints: number;
    actionPoints: number;
    size: { x: number, y: number };
}

export const TempPlayerUnitDef: UnitDef = {
    image: SpriteList.BROADSWORD,
    health: 8,
    movementPoints: 2,
    actionPoints: 2,
    size: { x: 1, y: 1 },
}

export const CaravanUnitDef: UnitDef = {
    image: SpriteList.CARAVAN,
    health: 1,
    movementPoints: 0,
    actionPoints: 0,
    size: { x: 2, y: 2 },
}

export const EnemyWolfUnitDef: UnitDef = {
    image: SpriteList.ENEMY_WOLF,
    health: 8,
    movementPoints: 2,
    actionPoints: 2,
    size: { x: 1, y: 1 },
}