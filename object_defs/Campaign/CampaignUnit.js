import MissionUnit from "./Mission/MissionUnit.js";

const ObjectVersion = 1;

class CampaignUnit {
    constructor(ownerId, unitId, unitName, ownerName) {
        this.ownerId = ownerId;
        this.unitId = unitId;
        this.unitName = unitName;
        this.ownerName = ownerName;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Campaign Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const campaignUnit = new CampaignUnit(jsonData.ownerId, jsonData.unitId, jsonData.unitName, jsonData.ownerName);
        return campaignUnit;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            ownerId: this.ownerId,
            ownerName: this.ownerName,
            unitId: this.unitId,
            unitName: this.unitName
        };
    }
    
    makeMissionUnit() {
        return new MissionUnit(this.ownerId, this.unitId, this.unitName, this.ownerName);
    }
};

export default CampaignUnit;
