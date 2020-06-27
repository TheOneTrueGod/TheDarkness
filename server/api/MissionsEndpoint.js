import Mission from "../../object_defs/Campaign/Mission/Mission.js";
import Campaign from "../../object_defs/Campaign/Campaign.js";
import { loadMission, saveCampaign, saveMission, loadCampaign } from "../datastore/datastore.js";

class MissionsEndpoint {
    static getResponse(user, uri, request, body) {
        if (uri.startsWith('/api/create-mission')) {
            const campaign = Campaign.fromJSONObject(loadCampaign(body.campaignId));
            if (!campaign) { throw new Error(`Couldn't find campaign ${body.campaignId}`); }

            const newMission = this.createMission(user, campaign);
            return { missionId: newMission.id };
        }

        if (uri.startsWith('/api/missions/add-unit')) {
            return this.addUnitToMission(body.campaignId, body.missionId, body.unitId)
        }

        if (uri.startsWith('/api/missions/remove-unit')) {
            return this.removeUnitFromMission(body.campaignId, body.missionId, body.unitId)
        }

        if (request.method === 'POST' && body && body.missionId !== undefined) {
            return this.getMission(body.campaignId, body.missionId);
        }
    }

    static createMission(user, campaign) {
        const newId = campaign.missionIndex;
        const newMission = new Mission(newId, campaign.id, user.id);
        
        campaign.missionIndex += 1;
        campaign.activeMissionIds.push(newId);

        saveCampaign(campaign);
        saveMission(newMission);

        return newMission;
    }

    static removeUnitFromMission(campaignId, missionId, unitId) {
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);

        const missionUnit = mission.unitList.find((missionUnit) => missionUnit.unitId === unitId);
        if (!missionUnit) { throw new Error(`Unit not in mission (unit id ${unitId})`); }

        mission.unitList.splice(mission.unitList.indexOf(missionUnit), 1);
        saveMission(mission);

        return mission.toJSONObject();
    }

    static addUnitToMission(campaignId, missionId, unitId) {
        const campaignJSON = loadCampaign(campaignId);
        const campaign = Campaign.fromJSONObject(campaignJSON);
        
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);

        const campaignUnit = campaign.campaignUnits.find((campaignUnit) => campaignUnit.unitId === unitId);
        
        if (!campaignUnit) {
            throw new Error(`Invalid unit id: ${unitId}`);
        }
        
        mission.unitList.push(campaignUnit.makeMissionUnit());
        
        saveMission(mission);

        return mission.toJSONObject();
    }

    static getMission(campaignId, missionId) {
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);
        if (mission) {
            return mission.toJSONObject();
        }
        throw new Error(`Mission '${missionId}' from campaign '${campaignId}' not found!`);
    }
}

export {
    MissionsEndpoint
};