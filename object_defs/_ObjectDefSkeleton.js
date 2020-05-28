const ObjectVersion = 1;

class _ObjectDefSkeleton {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`_ObjectDefSkeleton Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const _objectdefskeleton = new _ObjectDefSkeleton(jsonData.id, jsonData.name);
        return _objectdefskeleton;
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

export default _ObjectDefSkeleton;
