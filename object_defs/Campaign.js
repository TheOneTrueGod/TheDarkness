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

    /*static loadCampaign(id) {
        const jsonData = loadCampaign(id);
        
        if (!jsonData) { throw new Error(`Couldn't find campaign '${id}'`); }

        return this.fromJsonObject(jsonData);
    }*/

    static fromJsonObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Campaign Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const campaign = new Campaign(jsonData.id, jsonData.name);
        return campaign;
    }

    toJsonObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id
        };
    }
};

export default Campaign;
