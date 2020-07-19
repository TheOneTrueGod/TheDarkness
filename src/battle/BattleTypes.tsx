export declare type TileCoord = { x: number, y: number };
export declare type GamePosition = { x: number, y: number };

export const OWNER_MINION = 'owner_minion';
export const OWNER_PLAYERS = 'owner_players';
export declare type UnitOwner = number | 'owner_minion' | 'owner_players';

export declare type Team = 'players' | 'allies' | 'enemies';

export declare type CurrentTurn = {
    team: Team,
    owner: UnitOwner,
}

export enum CardinalDirection {
    NORTH,
    SOUTH,
    WEST,
    EAST
};