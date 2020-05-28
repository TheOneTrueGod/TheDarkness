import Mission from "../../object_defs/Campaign/Mission/Mission.js";
import { loadMission, saveCampaign, saveMission, loadCampaign } from "../datastore/datastore.js";

class MissionsEndpoint {
    static getResponse(user, uri, request, body) {
        if (uri.startsWith('/api/create-mission')) {
            const campaign = loadCampaign(user, body.campaignId);
            const newMission = this.createMission(campaign);
            return { id: newMission.id };
        }

        if (request.method === 'POST' && body && body.missionId !== undefined) {
            return this.getMission(body.missionId);
        }
    }

    static createMission(user, campaign) {
        const newId = campaign.missionIndex;
        const newMission = new Mission(newId, campaign.id, user.id);
        campaign.missionIndex += 1;
        saveCampaign(campaign);
        saveMission(newMission);
        return newMission;
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