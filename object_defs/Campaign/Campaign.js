import CampaignUnit from "./CampaignUnit.js";

const ObjectVersion = 1;
class Campaign {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.playerIds = [];
        this.activeMissionIds = [];
        this.missionIndex = 1;
        this.campaignUnits = [];
    }

    getCampaignUri() {
        return '/game/' + this.id;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`Campaign Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const campaign = new Campaign(jsonData.id, jsonData.name);
        campaign.playerIds = jsonData.playerIds;
        campaign.activeMissionIds = jsonData.activeMissionIds;
        campaign.missionIndex = jsonData.missionIndex;
        campaign.campaignUnits = jsonData.campaignUnits.map((campaignUnit) => { return CampaignUnit.fromJSONObject(campaignUnit); })
        return campaign;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id,
            playerIds: this.playerIds,
            activeMissionIds: this.activeMissionIds,
            missionIndex: this.missionIndex,
            campaignUnits: this.campaignUnits.map((campaignUnit) => campaignUnit.toJSONObject())
        };
    }
};

export default Campaign;
