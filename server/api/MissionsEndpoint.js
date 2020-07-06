import Mission from "../../object_defs/Campaign/Mission/Mission.js";
import Campaign from "../../object_defs/Campaign/Campaign.js";
import { loadMission, saveCampaign, saveMission, loadCampaign } from "../datastore/datastore.js";
import { setupAsActive } from "../helpers/MissionHelpers.js";

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

        if (uri.startsWith('/api/missions/start')) {
            return this.startMission(body.campaignId, body.missionId)
        }

        if (request.method === 'POST' && body && body.missionId !== undefined) {
            return this.getMission(body.campaignId, body.missionId, body.includeAllEvents);
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

    static startMission(campaignId, missionId) {
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);

        if (mission.caravan.unitList.length === 0) {
            throw new Error("Can't disembark with 0 units.");
        }

        if (mission.caravan.unitList.length > mission.caravan.unitSlots) {
            throw new Error("Too many units in caravan");
        }
        
        setupAsActive(mission); // Auto saves

        return mission.toJSONObject();
    }

    static removeUnitFromMission(campaignId, missionId, unitId) {
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);

        const missionUnit = mission.caravan.unitList.find((missionUnit) => missionUnit.unitId === unitId);
        if (!missionUnit) { throw new Error(`Unit not in mission (unit id ${unitId})`); }

        mission.caravan.unitList.splice(mission.caravan.unitList.indexOf(missionUnit), 1);
        saveMission(mission);

        return mission.toJSONObject();
    }

    static addUnitToMission(campaignId, missionId, unitId) {
        const campaignJSON = loadCampaign(campaignId);
        const campaign = Campaign.fromJSONObject(campaignJSON);
        
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);

        if (mission.caravan.unitList.length >= mission.caravan.unitSlots) {
            throw new Error(`Too many units on the caravan already`);
        }

        const campaignUnit = campaign.campaignUnits.find((campaignUnit) => campaignUnit.unitId === unitId);
        
        if (!campaignUnit) {
            throw new Error(`Invalid unit id: ${unitId}`);
        }
        
        mission.caravan.unitList.push(campaignUnit.makeMissionUnit());
        
        saveMission(mission);

        return mission.toJSONObject();
    }

    static getMission(campaignId, missionId, includeAllEvents) {
        const missionJSON = loadMission(campaignId, missionId);
        const mission = Mission.fromJSONObject(missionJSON);
        if (mission) {
            return mission.toJSONObject(includeAllEvents);
        }
        throw new Error(`Mission '${missionId}' from campaign '${campaignId}' not found!`);
    }
}

export {
    MissionsEndpoint
};