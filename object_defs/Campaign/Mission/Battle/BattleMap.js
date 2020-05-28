const ObjectVersion = 1;

class BattleMap {
    constructor() {
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`BattleMap Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const battleMap = new BattleMap();
        return battleMap;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
        };
    }
};

export default BattleMap;
