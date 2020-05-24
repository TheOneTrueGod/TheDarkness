const ObjectVersion = 1;

class User extends Networkable {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    toNetworkObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id,
        }
    }

    static fromNetworkObject(networkObject) {
        if (networkObject._v !== ObjectVersion) {
            throw new Error(`Recieved object version incompatible.  Network object: '${networkObject}' Object Version: '${ObjectVersion}`)
        }
        return new User(networkObject.id, networkObject.name);
    }

    static fromJsonObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`User Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const user = new User(jsonData.id, jsonData.name);
        return user;
    }

    toJsonObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id
        };
    }
}