import CampaignUnit from "./CampaignUnit.js";

export function CreateInitialUnits(campaign, user) {
    campaign.addCampaignUnit(
        new CampaignUnit(
            user.id,
            campaign.unitIndex,
            `${user.name} - ${campaign.unitIndex}`,
            `${user.name}`
        )
    );

    campaign.addCampaignUnit(
        new CampaignUnit(
            user.id,
            campaign.unitIndex,
            `${user.name} - ${campaign.unitIndex}`,
            `${user.name}`
        )
    );
}

const ObjectVersion = 1;
class Campaign {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.playerIds = [];
        this.activeMissionIds = [];
        this.missionIndex = 1;
        this.unitIndex = 1;
        this.campaignUnits = [];
    }

    addCampaignUnit(campaignUnit) {
        this.campaignUnits.push(campaignUnit);
        this.unitIndex += 1;
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
