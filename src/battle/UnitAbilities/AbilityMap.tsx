import AbilityBasicMove from './AbilityBasicMove';
import AbilityBasicAttack from './AbilityBasicAttack';

import AbilityBlinkMove from './AbilityBlinkMove';

import AbilitySwordSlash from './SwordTree/AbilitySwordSlash';
import AbilitySwordStrikethrough from './SwordTree/AbilitySwordStrikethrough';

const AbilityMap = {
    'BasicMove': new AbilityBasicMove,
    'BasicAttack': new AbilityBasicAttack,
    
    'BlinkMove': new AbilityBlinkMove,

    'SwordSlash': new AbilitySwordSlash,
    'SwordStrikethrough': new AbilitySwordStrikethrough,
};

export default AbilityMap;