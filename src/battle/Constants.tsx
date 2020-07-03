import { TileCoord } from './BattleTypes';
export default {
    getTileSize: (): TileCoord => {
        return { x: 20, y: 20 };
    }
}