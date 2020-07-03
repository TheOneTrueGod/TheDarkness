const ObjectVersion = 1;

class BattleMap {
    constructor() {
        this.mapSize = { x: 80, y: 60 };
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`BattleMap Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const battleMap = new BattleMap();
        battleMap.mapSize = jsonData.mapSize;
        return battleMap;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            mapSize: this.mapSize,
        };
    }
};

export default BattleMap;
