import { CrossbowBoltTypes, CrossbowBoltAbility } from "./CrossbowHelpers";
import AbilityCrossbowLoadExplosive from './AbilityCrossbowLoadExplosive';
import AbilityCrossbowReload from './AbilityCrossbowReload';

export const BoltTypeToAbility: Record<CrossbowBoltTypes, CrossbowBoltAbility> = {
    [CrossbowBoltTypes.NORMAL]: new AbilityCrossbowReload,
    [CrossbowBoltTypes.EXPLOSIVE]: new AbilityCrossbowLoadExplosive,
}