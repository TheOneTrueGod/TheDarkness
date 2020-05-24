import Campaign from "../../object_defs/Campaign.js";
import { getAllCampaignIds, saveCampaign, updateAllCampaignIds, loadCampaign } from "../datastore/datastore.js";

class CampaignsEndpoint {
    static getResponse(uri, request, body) {
        if (uri.startsWith('/api/create-campaign')) {
            const newCampaign = this.createCampaign();
            return { id: newCampaign.id };
        }

        if (
            request.method === 'GET' ||
            request.method === 'POST' && (!body || body.campaignId === undefined)
        ) {
            return this.getAllCampaigns();
        }

        if (request.method === 'POST' && body && body.campaignId !== undefined) {
            return this.getCampaign(body.campaignId);
        }
    }

    static createCampaign() {
        const campaignIds = getAllCampaignIds();
        const newId = campaignIds.reduce((a, b) => Math.max(a, b), 0) + 1;
        
        const newCampaign = new Campaign(newId, `Test Campaign ${newId}`);
        saveCampaign(newCampaign);
        campaignIds.push(newId);
        updateAllCampaignIds(campaignIds);

        return newCampaign;
    }

    static getCampaign(campaignId) {
        const campaignJSON = loadCampaign(campaignId);
        const campaign = Campaign.fromJsonObject(campaignJSON);
        if (campaign) {
            return campaign.toNetworkObject();
        }
        throw new Error(`Campaign '${campaignId}' not found!`);
    }

    static getAllCampaigns() {
        const campaignIds = getAllCampaignIds();
        return { 
            campaigns: campaignIds.map((campaignId) => {
                return this.getCampaign(campaignId);
            })
        };
    }
}

export {
    CampaignsEndpoint
};