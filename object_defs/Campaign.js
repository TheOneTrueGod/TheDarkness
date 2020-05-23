const ObjectVersion = 1;
class Campaign {
    constructor(name) {
        this.name = name;
    }

    toNetworkObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
        }
    }

    static fromNetworkObject(networkObject) {
        if (networkObject._v !== ObjectVersion) {
            throw new Error(`Recieved object version incompatible.  Network object: '${networkObject}' Object Version: '${ObjectVersion}`)
        }
        return new Campaign(networkObject.name);
    }
};

export default Campaign;
