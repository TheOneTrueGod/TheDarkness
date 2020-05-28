const ObjectVersion = 1;

class BattleUnit {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`BattleUnit Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const battleUnit = new BattleUnit(jsonData.id, jsonData.name);
        return battleUnit;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id,
            playerIds: this.playerIds
        };
    }
};

export default BattleUnit;
