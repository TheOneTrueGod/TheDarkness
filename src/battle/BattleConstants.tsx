import { TileCoord } from './BattleTypes';

export default {
    getTileSize: (): TileCoord => {
        return { x: 40, y: 40 };
    }
}