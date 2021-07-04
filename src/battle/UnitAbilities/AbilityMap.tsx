import AbilityBasicMove from './AbilityBasicMove';
import AbilityBasicAttack from './AbilityBasicAttack';

import AbilityBlinkMove from './AbilityBlinkMove';

import AbilitySwordBasic from './TreeSword/AbilitySwordBasic';
import AbilitySwordSlash from './TreeSword/AbilitySwordSlash';
import AbilitySwordStrikethrough from './TreeSword/AbilitySwordStrikethrough';

import AbilityCrossbowBasic from './TreeCrossbow/AbilityCrossbowBasic';
import AbilityCrossbowReload from './TreeCrossbow/AbilityCrossbowReload';
import AbilityCrossbowLoadExplosive from './TreeCrossbow/AbilityCrossbowLoadExplosive';

const AbilityMap = {
    'BasicMove': new AbilityBasicMove,
    'BasicAttack': new AbilityBasicAttack,
    
    'BlinkMove': new AbilityBlinkMove,

    'SwordBasic': new AbilitySwordBasic,
    'SwordSlash': new AbilitySwordSlash,
    'SwordStrikethrough': new AbilitySwordStrikethrough,

    'CrossbowBasic': new AbilityCrossbowBasic,
    'CrossbowReload': new AbilityCrossbowReload,
    'CrossbowLoadExplosive': new AbilityCrossbowLoadExplosive,

};

export default AbilityMap;