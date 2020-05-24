const ObjectVersion = 1;
class Campaign {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    getCampaignUri() {
        return '/game/' + this.id;
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
        return new Campaign(networkObject.id, networkObject.name);
    }
};

export default Campaign;
