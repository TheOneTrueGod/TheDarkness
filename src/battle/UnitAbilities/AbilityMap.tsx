import AbilityBasicMove from './AbilityBasicMove';
import AbilityBasicAttack from './AbilityBasicAttack';

import AbilityBlinkMove from './AbilityBasicMove';

const AbilityMap = {
    'BasicMove': new AbilityBasicMove,
    'BasicAttack': new AbilityBasicAttack,
    'BlinkMove': new AbilityBlinkMove,
};

export default AbilityMap;